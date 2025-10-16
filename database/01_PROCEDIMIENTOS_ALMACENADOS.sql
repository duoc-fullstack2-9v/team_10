-- ================================================
-- PROCEDIMIENTOS ALMACENADOS PARA HUERTO HOGAR
-- Proyecto: Sistema de Gestión de Huertos Orgánicos
-- Curso: Programación de Base de Datos
-- ================================================

-- ==============================================================================
-- PROCEDIMIENTO 1: SIN PARÁMETROS - ACTUALIZACIÓN MASIVA DE STOCK
-- Propósito: Actualizar automáticamente el stock de productos con stock bajo
-- Tipo: Procesamiento masivo sin parámetros de entrada
-- ==============================================================================

CREATE OR REPLACE PROCEDURE PROC_ACTUALIZAR_STOCK_MASIVO
IS
    v_contador NUMBER := 0;
    v_fecha_proceso DATE := SYSDATE;
    
    -- Cursor para productos con stock bajo
    CURSOR c_productos_stock_bajo IS
        SELECT p.id_producto, p.nombre_producto, p.stock_actual, p.stock_minimo
        FROM productos p
        WHERE p.stock_actual <= p.stock_minimo
        AND p.estado = 'ACTIVO';
        
    -- Record para manejar los datos del cursor
    r_producto c_productos_stock_bajo%ROWTYPE;
    
BEGIN
    -- Mensaje de inicio del proceso
    DBMS_OUTPUT.PUT_LINE('=== INICIO PROCESO ACTUALIZACIÓN MASIVA DE STOCK ===');
    DBMS_OUTPUT.PUT_LINE('Fecha y hora de proceso: ' || TO_CHAR(v_fecha_proceso, 'DD/MM/YYYY HH24:MI:SS'));
    
    -- Abrir cursor y procesar productos
    OPEN c_productos_stock_bajo;
    
    LOOP
        FETCH c_productos_stock_bajo INTO r_producto;
        EXIT WHEN c_productos_stock_bajo%NOTFOUND;
        
        -- Actualizar stock al doble del mínimo (política de reposición)
        UPDATE productos 
        SET stock_actual = (stock_minimo * 2),
            fecha_ultima_actualizacion = v_fecha_proceso,
            usuario_actualizacion = 'SISTEMA_AUTO'
        WHERE id_producto = r_producto.id_producto;
        
        -- Insertar log de la actualización
        INSERT INTO log_actualizaciones_stock 
        (id_producto, stock_anterior, stock_nuevo, fecha_actualizacion, motivo, usuario)
        VALUES 
        (r_producto.id_producto, 
         r_producto.stock_actual, 
         (r_producto.stock_minimo * 2),
         v_fecha_proceso,
         'REPOSICION_AUTOMATICA',
         'SISTEMA_AUTO');
        
        -- Incrementar contador
        v_contador := v_contador + 1;
        
        -- Mensaje de progreso
        DBMS_OUTPUT.PUT_LINE('Producto actualizado: ' || r_producto.nombre_producto || 
                           ' | Stock anterior: ' || r_producto.stock_actual || 
                           ' | Stock nuevo: ' || (r_producto.stock_minimo * 2));
    END LOOP;
    
    CLOSE c_productos_stock_bajo;
    
    -- Confirmar transacción
    COMMIT;
    
    -- Mensaje de finalización
    DBMS_OUTPUT.PUT_LINE('=== PROCESO COMPLETADO EXITOSAMENTE ===');
    DBMS_OUTPUT.PUT_LINE('Total de productos actualizados: ' || v_contador);
    DBMS_OUTPUT.PUT_LINE('Fecha de finalización: ' || TO_CHAR(SYSDATE, 'DD/MM/YYYY HH24:MI:SS'));
    
EXCEPTION
    WHEN OTHERS THEN
        -- Rollback en caso de error
        ROLLBACK;
        
        -- Log del error
        DBMS_OUTPUT.PUT_LINE('ERROR en PROC_ACTUALIZAR_STOCK_MASIVO: ' || SQLCODE || ' - ' || SQLERRM);
        
        -- Re-lanzar la excepción
        RAISE;
END PROC_ACTUALIZAR_STOCK_MASIVO;
/

-- ==============================================================================
-- PROCEDIMIENTO 2: CON PARÁMETROS - CREAR USUARIO COMPLETO
-- Propósito: Crear un usuario completo con validaciones y configuración automática
-- Tipo: Procesamiento de datos con múltiples parámetros de entrada
-- ==============================================================================

CREATE OR REPLACE PROCEDURE PROC_CREAR_USUARIO_COMPLETO (
    p_rut IN VARCHAR2,
    p_nombre IN VARCHAR2,
    p_apellido IN VARCHAR2,
    p_email IN VARCHAR2,
    p_telefono IN VARCHAR2,
    p_direccion IN VARCHAR2,
    p_region IN VARCHAR2,
    p_comuna IN VARCHAR2,
    p_password IN VARCHAR2,
    p_tipo_usuario IN VARCHAR2 DEFAULT 'Cliente',
    p_usuario_creador IN VARCHAR2 DEFAULT 'SISTEMA',
    p_id_usuario_nuevo OUT NUMBER
)
IS
    v_existe_rut NUMBER;
    v_existe_email NUMBER;
    v_password_hash VARCHAR2(256);
    v_fecha_creacion DATE := SYSDATE;
    v_codigo_verificacion VARCHAR2(8);
    
BEGIN
    -- Mensaje de inicio
    DBMS_OUTPUT.PUT_LINE('=== CREANDO USUARIO COMPLETO ===');
    DBMS_OUTPUT.PUT_LINE('RUT: ' || p_rut || ' | Nombre: ' || p_nombre || ' ' || p_apellido);
    
    -- Validar parámetros obligatorios
    IF p_rut IS NULL OR p_nombre IS NULL OR p_email IS NULL THEN
        RAISE_APPLICATION_ERROR(-20001, 'Los campos RUT, Nombre y Email son obligatorios');
    END IF;
    
    -- Validar formato de email básico
    IF INSTR(p_email, '@') = 0 OR INSTR(p_email, '.') = 0 THEN
        RAISE_APPLICATION_ERROR(-20002, 'El formato del email no es válido');
    END IF;
    
    -- Verificar si ya existe el RUT
    SELECT COUNT(*)
    INTO v_existe_rut
    FROM usuarios
    WHERE rut = p_rut;
    
    IF v_existe_rut > 0 THEN
        RAISE_APPLICATION_ERROR(-20003, 'Ya existe un usuario registrado con el RUT: ' || p_rut);
    END IF;
    
    -- Verificar si ya existe el email
    SELECT COUNT(*)
    INTO v_existe_email
    FROM usuarios
    WHERE email = p_email;
    
    IF v_existe_email > 0 THEN
        RAISE_APPLICATION_ERROR(-20004, 'Ya existe un usuario registrado con el email: ' || p_email);
    END IF;
    
    -- Generar hash de password (simulado - en producción usar algoritmo seguro)
    v_password_hash := 'HASH_' || UPPER(SUBSTR(p_password, 1, 10)) || '_' || TO_CHAR(v_fecha_creacion, 'YYYYMMDDHH24MISS');
    
    -- Generar código de verificación aleatorio
    SELECT LPAD(TRUNC(DBMS_RANDOM.VALUE(10000000, 99999999)), 8, '0')
    INTO v_codigo_verificacion
    FROM DUAL;
    
    -- Obtener el siguiente ID de secuencia
    SELECT seq_usuarios.NEXTVAL
    INTO p_id_usuario_nuevo
    FROM DUAL;
    
    -- Insertar el nuevo usuario
    INSERT INTO usuarios (
        id_usuario,
        rut,
        nombre,
        apellido,
        email,
        telefono,
        direccion,
        region,
        comuna,
        password_hash,
        tipo_usuario,
        estado,
        fecha_creacion,
        usuario_creador,
        fecha_ultima_actualizacion,
        codigo_verificacion,
        email_verificado
    ) VALUES (
        p_id_usuario_nuevo,
        p_rut,
        p_nombre,
        p_apellido,
        p_email,
        p_telefono,
        p_direccion,
        p_region,
        p_comuna,
        v_password_hash,
        p_tipo_usuario,
        'ACTIVO',
        v_fecha_creacion,
        p_usuario_creador,
        v_fecha_creacion,
        v_codigo_verificacion,
        'N'
    );
    
    -- Insertar perfil por defecto
    INSERT INTO perfiles_usuario (
        id_usuario,
        preferencias_notificacion,
        tema_aplicacion,
        idioma,
        fecha_creacion
    ) VALUES (
        p_id_usuario_nuevo,
        'EMAIL,SMS',
        'CLARO',
        'ES',
        v_fecha_creacion
    );
    
    -- Insertar en auditoría
    INSERT INTO auditoria_usuarios (
        id_usuario,
        accion,
        detalle,
        fecha_accion,
        usuario_accion,
        ip_address
    ) VALUES (
        p_id_usuario_nuevo,
        'CREACION',
        'Usuario creado: ' || p_nombre || ' ' || p_apellido || ' (RUT: ' || p_rut || ')',
        v_fecha_creacion,
        p_usuario_creador,
        'SISTEMA'
    );
    
    -- Confirmar transacción
    COMMIT;
    
    -- Mensaje de éxito
    DBMS_OUTPUT.PUT_LINE('Usuario creado exitosamente con ID: ' || p_id_usuario_nuevo);
    DBMS_OUTPUT.PUT_LINE('Código de verificación: ' || v_codigo_verificacion);
    DBMS_OUTPUT.PUT_LINE('Fecha de creación: ' || TO_CHAR(v_fecha_creacion, 'DD/MM/YYYY HH24:MI:SS'));
    
EXCEPTION
    WHEN OTHERS THEN
        -- Rollback en caso de error
        ROLLBACK;
        
        -- Log del error
        DBMS_OUTPUT.PUT_LINE('ERROR en PROC_CREAR_USUARIO_COMPLETO: ' || SQLCODE || ' - ' || SQLERRM);
        
        -- Re-lanzar la excepción
        RAISE;
END PROC_CREAR_USUARIO_COMPLETO;
/

-- ==============================================================================
-- PROCEDIMIENTO 3: CON PARÁMETROS - GENERAR REPORTE DE VENTAS
-- Propósito: Generar reporte completo de ventas por período y categoría
-- Tipo: Procesamiento complejo con múltiples parámetros y cálculos
-- ==============================================================================

CREATE OR REPLACE PROCEDURE PROC_GENERAR_REPORTE_VENTAS (
    p_fecha_inicio IN DATE,
    p_fecha_fin IN DATE,
    p_categoria IN VARCHAR2 DEFAULT NULL,
    p_formato_salida IN VARCHAR2 DEFAULT 'PANTALLA',
    p_usuario_solicitante IN VARCHAR2,
    p_total_ventas OUT NUMBER,
    p_total_productos OUT NUMBER,
    p_promedio_venta OUT NUMBER
)
IS
    v_contador NUMBER := 0;
    v_suma_ventas NUMBER := 0;
    v_fecha_proceso DATE := SYSDATE;
    v_categoria_filtro VARCHAR2(100);
    
    -- Cursor dinámico para las ventas
    TYPE t_cursor IS REF CURSOR;
    c_ventas t_cursor;
    v_sql VARCHAR2(4000);
    
    -- Variables para el cursor
    v_producto_nombre VARCHAR2(200);
    v_categoria_nombre VARCHAR2(100);
    v_cantidad_vendida NUMBER;
    v_precio_unitario NUMBER(10,2);
    v_total_linea NUMBER(10,2);
    v_fecha_venta DATE;
    
BEGIN
    -- Validación de parámetros
    IF p_fecha_inicio IS NULL OR p_fecha_fin IS NULL THEN
        RAISE_APPLICATION_ERROR(-20005, 'Las fechas de inicio y fin son obligatorias');
    END IF;
    
    IF p_fecha_inicio > p_fecha_fin THEN
        RAISE_APPLICATION_ERROR(-20006, 'La fecha de inicio no puede ser mayor a la fecha de fin');
    END IF;
    
    -- Mensaje de inicio
    DBMS_OUTPUT.PUT_LINE('========================================');
    DBMS_OUTPUT.PUT_LINE('    REPORTE DE VENTAS - HUERTO HOGAR    ');
    DBMS_OUTPUT.PUT_LINE('========================================');
    DBMS_OUTPUT.PUT_LINE('Período: ' || TO_CHAR(p_fecha_inicio, 'DD/MM/YYYY') || ' - ' || TO_CHAR(p_fecha_fin, 'DD/MM/YYYY'));
    DBMS_OUTPUT.PUT_LINE('Categoría: ' || NVL(p_categoria, 'TODAS'));
    DBMS_OUTPUT.PUT_LINE('Solicitado por: ' || p_usuario_solicitante);
    DBMS_OUTPUT.PUT_LINE('Fecha de generación: ' || TO_CHAR(v_fecha_proceso, 'DD/MM/YYYY HH24:MI:SS'));
    DBMS_OUTPUT.PUT_LINE('========================================');
    
    -- Construir SQL dinámico
    v_sql := 'SELECT p.nombre_producto, c.nombre_categoria, dv.cantidad, dv.precio_unitario, 
                     (dv.cantidad * dv.precio_unitario) as total_linea, v.fecha_venta
              FROM ventas v
              INNER JOIN detalle_ventas dv ON v.id_venta = dv.id_venta
              INNER JOIN productos p ON dv.id_producto = p.id_producto
              INNER JOIN categorias c ON p.id_categoria = c.id_categoria
              WHERE v.fecha_venta BETWEEN :fecha_inicio AND :fecha_fin
              AND v.estado = ''COMPLETADA''';
    
    -- Agregar filtro de categoría si es especificado
    IF p_categoria IS NOT NULL THEN
        v_sql := v_sql || ' AND UPPER(c.nombre_categoria) = UPPER(:categoria)';
        v_categoria_filtro := UPPER(p_categoria);
    END IF;
    
    v_sql := v_sql || ' ORDER BY v.fecha_venta DESC, p.nombre_producto';
    
    -- Abrir cursor dinámico
    IF p_categoria IS NOT NULL THEN
        OPEN c_ventas FOR v_sql USING p_fecha_inicio, p_fecha_fin, v_categoria_filtro;
    ELSE
        OPEN c_ventas FOR v_sql USING p_fecha_inicio, p_fecha_fin;
    END IF;
    
    -- Encabezados del reporte
    DBMS_OUTPUT.PUT_LINE('PRODUCTO' || CHR(9) || 'CATEGORÍA' || CHR(9) || 'CANTIDAD' || CHR(9) || 'PRECIO UNIT.' || CHR(9) || 'TOTAL' || CHR(9) || 'FECHA');
    DBMS_OUTPUT.PUT_LINE('--------------------------------------------------------------------------------------------------------');
    
    -- Procesar resultados
    LOOP
        FETCH c_ventas INTO v_producto_nombre, v_categoria_nombre, v_cantidad_vendida, 
                           v_precio_unitario, v_total_linea, v_fecha_venta;
        EXIT WHEN c_ventas%NOTFOUND;
        
        -- Mostrar línea del reporte
        DBMS_OUTPUT.PUT_LINE(
            RPAD(v_producto_nombre, 20) || CHR(9) ||
            RPAD(v_categoria_nombre, 15) || CHR(9) ||
            LPAD(TO_CHAR(v_cantidad_vendida), 8) || CHR(9) ||
            LPAD(TO_CHAR(v_precio_unitario, '999,999.99'), 10) || CHR(9) ||
            LPAD(TO_CHAR(v_total_linea, '999,999.99'), 10) || CHR(9) ||
            TO_CHAR(v_fecha_venta, 'DD/MM/YY')
        );
        
        -- Acumular totales
        v_contador := v_contador + 1;
        v_suma_ventas := v_suma_ventas + v_total_linea;
        
    END LOOP;
    
    CLOSE c_ventas;
    
    -- Calcular promedios y totales
    p_total_ventas := v_suma_ventas;
    p_total_productos := v_contador;
    
    IF v_contador > 0 THEN
        p_promedio_venta := v_suma_ventas / v_contador;
    ELSE
        p_promedio_venta := 0;
    END IF;
    
    -- Mostrar resumen
    DBMS_OUTPUT.PUT_LINE('--------------------------------------------------------------------------------------------------------');
    DBMS_OUTPUT.PUT_LINE('RESUMEN DEL REPORTE:');
    DBMS_OUTPUT.PUT_LINE('Total de líneas de venta: ' || v_contador);
    DBMS_OUTPUT.PUT_LINE('Total de ventas: $' || TO_CHAR(p_total_ventas, '999,999,999.99'));
    DBMS_OUTPUT.PUT_LINE('Promedio por línea: $' || TO_CHAR(p_promedio_venta, '999,999.99'));
    DBMS_OUTPUT.PUT_LINE('========================================');
    
    -- Registrar en log de reportes
    INSERT INTO log_reportes (
        tipo_reporte,
        parametros,
        usuario_solicitante,
        fecha_generacion,
        total_registros,
        estado
    ) VALUES (
        'VENTAS_POR_PERIODO',
        'Inicio: ' || TO_CHAR(p_fecha_inicio, 'DD/MM/YYYY') || 
        ', Fin: ' || TO_CHAR(p_fecha_fin, 'DD/MM/YYYY') || 
        ', Categoría: ' || NVL(p_categoria, 'TODAS'),
        p_usuario_solicitante,
        v_fecha_proceso,
        v_contador,
        'COMPLETADO'
    );
    
    COMMIT;
    
EXCEPTION
    WHEN OTHERS THEN
        -- Rollback en caso de error
        ROLLBACK;
        
        -- Log del error
        DBMS_OUTPUT.PUT_LINE('ERROR en PROC_GENERAR_REPORTE_VENTAS: ' || SQLCODE || ' - ' || SQLERRM);
        
        -- Registrar error en log
        INSERT INTO log_reportes (
            tipo_reporte,
            parametros,
            usuario_solicitante,
            fecha_generacion,
            total_registros,
            estado,
            mensaje_error
        ) VALUES (
            'VENTAS_POR_PERIODO',
            'ERROR - Inicio: ' || TO_CHAR(p_fecha_inicio, 'DD/MM/YYYY') || 
            ', Fin: ' || TO_CHAR(p_fecha_fin, 'DD/MM/YYYY'),
            p_usuario_solicitante,
            v_fecha_proceso,
            0,
            'ERROR',
            SQLERRM
        );
        
        COMMIT;
        
        -- Re-lanzar la excepción
        RAISE;
END PROC_GENERAR_REPORTE_VENTAS;
/

-- ================================================
-- COMANDOS DE VALIDACIÓN Y PRUEBA
-- ================================================

-- Verificar que los procedimientos se crearon correctamente
SELECT object_name, object_type, status 
FROM user_objects 
WHERE object_type = 'PROCEDURE' 
AND object_name IN ('PROC_ACTUALIZAR_STOCK_MASIVO', 'PROC_CREAR_USUARIO_COMPLETO', 'PROC_GENERAR_REPORTE_VENTAS');

-- Mostrar información de los procedimientos
SELECT object_name, created, last_ddl_time, status
FROM user_objects 
WHERE object_type = 'PROCEDURE' 
AND object_name LIKE 'PROC_%'
ORDER BY object_name;