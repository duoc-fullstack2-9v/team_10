-- =============================================
-- ENTREGA 2: TRIGGERS AVANZADOS PARA PROCESAMIENTO MASIVO
-- Sistema HuertoHogar - Implementación Avanzada PL/SQL
-- =============================================

-- =============================================
-- 1. TRIGGERS DE AUDITORÍA MASIVA
-- =============================================

-- Tabla de auditoría para cambios masivos
CREATE TABLE auditoria_cambios_masivos (
    id_auditoria NUMBER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    tabla_afectada VARCHAR2(50),
    tipo_operacion VARCHAR2(20), -- INSERT, UPDATE, DELETE
    usuario_bd VARCHAR2(50),
    fecha_operacion DATE DEFAULT SYSDATE,
    cantidad_registros NUMBER,
    detalles_cambio CLOB,
    ip_origen VARCHAR2(50),
    programa_origen VARCHAR2(100)
);

-- Tabla para log de triggers
CREATE TABLE log_triggers_masivos (
    id_log NUMBER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    trigger_name VARCHAR2(100),
    tabla_afectada VARCHAR2(50),
    operacion VARCHAR2(20),
    fecha_ejecucion DATE DEFAULT SYSDATE,
    tiempo_ejecucion_ms NUMBER,
    registros_procesados NUMBER,
    mensaje_resultado VARCHAR2(500),
    datos_adicionales CLOB
);

-- =============================================
-- TRIGGER 1: Auditoría de cambios masivos en PRODUCTO
-- =============================================
CREATE OR REPLACE TRIGGER trg_auditoria_producto_masivo
    AFTER INSERT OR UPDATE OR DELETE ON producto
    FOR EACH ROW
DECLARE
    v_operacion VARCHAR2(20);
    v_detalles CLOB;
    v_inicio_tiempo NUMBER;
BEGIN
    v_inicio_tiempo := DBMS_UTILITY.GET_TIME;
    
    -- Determinar tipo de operación
    IF INSERTING THEN
        v_operacion := 'INSERT';
        v_detalles := 'Nuevo producto: ' || :NEW.nombre || 
                     ', Precio: $' || :NEW.precio || 
                     ', Stock: ' || :NEW.stock ||
                     ', Categoría: ' || :NEW.id_categoria;
                     
    ELSIF UPDATING THEN
        v_operacion := 'UPDATE';
        v_detalles := 'Producto: ' || :NEW.nombre;
        
        -- Detectar qué campos cambiaron
        IF NVL(:OLD.precio, 0) != NVL(:NEW.precio, 0) THEN
            v_detalles := v_detalles || ', Precio: ' || :OLD.precio || ' → ' || :NEW.precio;
        END IF;
        
        IF NVL(:OLD.stock, 0) != NVL(:NEW.stock, 0) THEN
            v_detalles := v_detalles || ', Stock: ' || :OLD.stock || ' → ' || :NEW.stock;
        END IF;
        
        IF NVL(:OLD.esta_activo, 'N') != NVL(:NEW.esta_activo, 'N') THEN
            v_detalles := v_detalles || ', Estado: ' || :OLD.esta_activo || ' → ' || :NEW.esta_activo;
        END IF;
        
    ELSIF DELETING THEN
        v_operacion := 'DELETE';
        v_detalles := 'Producto eliminado: ' || :OLD.nombre || 
                     ', Precio: $' || :OLD.precio || 
                     ', Stock: ' || :OLD.stock;
    END IF;
    
    -- Insertar en tabla de auditoría (usando procedimiento autónomo para evitar mutating table)
    INSERT INTO auditoria_cambios_masivos (
        tabla_afectada, tipo_operacion, usuario_bd, 
        cantidad_registros, detalles_cambio, programa_origen
    ) VALUES (
        'PRODUCTO', v_operacion, USER, 
        1, v_detalles, 
        NVL(SYS_CONTEXT('USERENV', 'MODULE'), 'DESCONOCIDO')
    );
    
    -- Log del trigger
    INSERT INTO log_triggers_masivos (
        trigger_name, tabla_afectada, operacion,
        tiempo_ejecucion_ms, registros_procesados, mensaje_resultado
    ) VALUES (
        'TRG_AUDITORIA_PRODUCTO_MASIVO', 'PRODUCTO', v_operacion,
        DBMS_UTILITY.GET_TIME - v_inicio_tiempo, 1, 'Auditoría registrada correctamente'
    );
    
EXCEPTION
    WHEN OTHERS THEN
        -- Log del error sin afectar la operación principal
        INSERT INTO log_triggers_masivos (
            trigger_name, tabla_afectada, operacion,
            registros_procesados, mensaje_resultado
        ) VALUES (
            'TRG_AUDITORIA_PRODUCTO_MASIVO', 'PRODUCTO', v_operacion,
            0, 'ERROR: ' || SQLERRM
        );
END trg_auditoria_producto_masivo;
/

-- =============================================
-- TRIGGER 2: Control automático de stock y alertas masivas
-- =============================================
CREATE OR REPLACE TRIGGER trg_control_stock_automatico
    AFTER UPDATE OF stock ON producto
    FOR EACH ROW
WHEN (NEW.stock <= 10 OR (OLD.stock > 10 AND NEW.stock <= 10))
DECLARE
    PRAGMA AUTONOMOUS_TRANSACTION;
    v_mensaje_alerta VARCHAR2(500);
    v_nivel_criticidad VARCHAR2(20);
BEGIN
    -- Determinar nivel de criticidad
    IF :NEW.stock = 0 THEN
        v_nivel_criticidad := 'CRÍTICO';
        v_mensaje_alerta := 'STOCK AGOTADO: ' || :NEW.nombre || ' - Se requiere reposición URGENTE';
    ELSIF :NEW.stock <= 3 THEN
        v_nivel_criticidad := 'ALTO';
        v_mensaje_alerta := 'STOCK MUY BAJO: ' || :NEW.nombre || ' - Solo quedan ' || :NEW.stock || ' unidades';
    ELSIF :NEW.stock <= 10 THEN
        v_nivel_criticidad := 'MEDIO';
        v_mensaje_alerta := 'STOCK BAJO: ' || :NEW.nombre || ' - Quedan ' || :NEW.stock || ' unidades';
    END IF;
    
    -- Si el producto tiene ventas frecuentes, aumentar criticidad
    DECLARE
        v_ventas_recientes NUMBER := 0;
    BEGIN
        SELECT COUNT(*)
        INTO v_ventas_recientes
        FROM detalle_pedido dp
        JOIN pedido p ON dp.id_pedido = p.id_pedido
        WHERE dp.id_producto = :NEW.id_producto
        AND p.fecha_pedido >= SYSDATE - 7; -- Últimos 7 días
        
        IF v_ventas_recientes > 5 AND :NEW.stock <= 5 THEN
            v_nivel_criticidad := 'CRÍTICO';
            v_mensaje_alerta := v_mensaje_alerta || ' - PRODUCTO DE ALTA ROTACIÓN';
        END IF;
    END;
    
    -- Insertar alerta en sistema
    INSERT INTO log_triggers_masivos (
        trigger_name, tabla_afectada, operacion,
        registros_procesados, mensaje_resultado, datos_adicionales
    ) VALUES (
        'TRG_CONTROL_STOCK_AUTOMATICO', 'PRODUCTO', 'STOCK_ALERT',
        1, v_mensaje_alerta, 
        'ID_PRODUCTO: ' || :NEW.id_producto || 
        ', STOCK_ANTERIOR: ' || :OLD.stock ||
        ', STOCK_ACTUAL: ' || :NEW.stock ||
        ', CRITICIDAD: ' || v_nivel_criticidad
    );
    
    -- Auto-reposición para productos críticos de alta rotación
    IF v_nivel_criticidad = 'CRÍTICO' AND :NEW.stock = 0 THEN
        -- Simular pedido automático a proveedor
        INSERT INTO log_triggers_masivos (
            trigger_name, tabla_afectada, operacion,
            registros_procesados, mensaje_resultado, datos_adicionales
        ) VALUES (
            'TRG_CONTROL_STOCK_AUTOMATICO', 'PRODUCTO', 'AUTO_REORDER',
            1, 'Pedido automático generado para: ' || :NEW.nombre,
            'CANTIDAD_SUGERIDA: 50, PROVEEDOR: AUTO, URGENCIA: ALTA'
        );
    END IF;
    
    COMMIT;
    
EXCEPTION
    WHEN OTHERS THEN
        ROLLBACK;
        -- No propagar el error para no afectar la operación principal
        NULL;
END trg_control_stock_automatico;
/

-- =============================================
-- TRIGGER 3: Validación y procesamiento masivo de pedidos
-- =============================================
CREATE OR REPLACE TRIGGER trg_procesamiento_pedidos_masivo
    AFTER INSERT OR UPDATE ON pedido
    FOR EACH ROW
WHEN (NEW.estado_pedido_id_estado = 1) -- Solo para pedidos pendientes
DECLARE
    PRAGMA AUTONOMOUS_TRANSACTION;
    v_productos_sin_stock NUMBER := 0;
    v_valor_total_validado NUMBER := 0;
    v_mensaje_resultado VARCHAR2(500);
    v_requiere_validacion BOOLEAN := FALSE;
BEGIN
    -- Validar disponibilidad de stock para todos los productos del pedido
    SELECT COUNT(*)
    INTO v_productos_sin_stock
    FROM detalle_pedido dp
    JOIN producto p ON dp.id_producto = p.id_producto
    WHERE dp.id_pedido = :NEW.id_pedido
    AND (p.stock < dp.cantidad OR p.esta_activo = 'N');
    
    -- Calcular valor total validado
    SELECT NVL(SUM(dp.cantidad * dp.precio_unitario), 0)
    INTO v_valor_total_validado
    FROM detalle_pedido dp
    JOIN producto p ON dp.id_producto = p.id_producto
    WHERE dp.id_pedido = :NEW.id_pedido
    AND p.stock >= dp.cantidad
    AND p.esta_activo = 'S';
    
    -- Determinar si requiere validación especial
    IF :NEW.total > 500 OR v_productos_sin_stock > 0 THEN
        v_requiere_validacion := TRUE;
    END IF;
    
    -- Generar mensaje de resultado
    IF v_productos_sin_stock = 0 THEN
        v_mensaje_resultado := 'Pedido VÁLIDO - Todos los productos disponibles';
        
        -- Si es un pedido grande, marcar para revisión
        IF :NEW.total > 1000 THEN
            v_mensaje_resultado := v_mensaje_resultado || ' - PEDIDO GRANDE (Requiere revisión)';
        END IF;
        
    ELSE
        v_mensaje_resultado := 'Pedido PARCIAL - ' || v_productos_sin_stock || ' productos sin stock';
    END IF;
    
    -- Registrar validación
    INSERT INTO log_triggers_masivos (
        trigger_name, tabla_afectada, operacion,
        registros_procesados, mensaje_resultado, datos_adicionales
    ) VALUES (
        'TRG_PROCESAMIENTO_PEDIDOS_MASIVO', 'PEDIDO', 'VALIDACION',
        1, v_mensaje_resultado,
        'ID_PEDIDO: ' || :NEW.id_pedido ||
        ', TOTAL: $' || :NEW.total ||
        ', PRODUCTOS_SIN_STOCK: ' || v_productos_sin_stock ||
        ', VALOR_VALIDADO: $' || v_valor_total_validado ||
        ', REQUIERE_REVISION: ' || CASE WHEN v_requiere_validacion THEN 'SI' ELSE 'NO' END
    );
    
    -- Auto-procesamiento para pedidos pequeños sin problemas
    IF v_productos_sin_stock = 0 AND :NEW.total <= 200 AND NOT INSERTING THEN
        -- Actualizar estado a "En Proceso" automáticamente
        UPDATE pedido 
        SET estado_pedido_id_estado = 2,
            fecha_actualizacion = SYSDATE
        WHERE id_pedido = :NEW.id_pedido;
        
        INSERT INTO log_triggers_masivos (
            trigger_name, tabla_afectada, operacion,
            registros_procesados, mensaje_resultado
        ) VALUES (
            'TRG_PROCESAMIENTO_PEDIDOS_MASIVO', 'PEDIDO', 'AUTO_PROCESO',
            1, 'Pedido procesado automáticamente - ID: ' || :NEW.id_pedido
        );
    END IF;
    
    COMMIT;
    
EXCEPTION
    WHEN OTHERS THEN
        ROLLBACK;
        -- Log del error
        INSERT INTO log_triggers_masivos (
            trigger_name, tabla_afectada, operacion,
            registros_procesados, mensaje_resultado
        ) VALUES (
            'TRG_PROCESAMIENTO_PEDIDOS_MASIVO', 'PEDIDO', 'ERROR',
            0, 'ERROR en validación: ' || SQLERRM
        );
        COMMIT;
END trg_procesamiento_pedidos_masivo;
/

-- =============================================
-- TRIGGER 4: Sincronización masiva de datos relacionados
-- =============================================
CREATE OR REPLACE TRIGGER trg_sincronizacion_masiva_categoria
    AFTER UPDATE OF nombre ON categoria
    FOR EACH ROW
WHEN (OLD.nombre != NEW.nombre)
DECLARE
    PRAGMA AUTONOMOUS_TRANSACTION;
    v_productos_afectados NUMBER := 0;
    v_pedidos_relacionados NUMBER := 0;
BEGIN
    -- Contar productos afectados
    SELECT COUNT(*)
    INTO v_productos_afectados
    FROM producto
    WHERE id_categoria = :NEW.id_categoria
    AND esta_activo = 'S';
    
    -- Contar pedidos relacionados (últimos 30 días)
    SELECT COUNT(DISTINCT p.id_pedido)
    INTO v_pedidos_relacionados
    FROM pedido p
    JOIN detalle_pedido dp ON p.id_pedido = dp.id_pedido
    JOIN producto pr ON dp.id_producto = pr.id_producto
    WHERE pr.id_categoria = :NEW.id_categoria
    AND p.fecha_pedido >= SYSDATE - 30;
    
    -- Registro de cambio masivo
    INSERT INTO auditoria_cambios_masivos (
        tabla_afectada, tipo_operacion, usuario_bd,
        cantidad_registros, detalles_cambio
    ) VALUES (
        'CATEGORIA', 'UPDATE_MASIVO', USER,
        v_productos_afectados + v_pedidos_relacionados,
        'Cambio de categoría: "' || :OLD.nombre || '" → "' || :NEW.nombre || '"' ||
        ' - Productos afectados: ' || v_productos_afectados ||
        ' - Pedidos relacionados (30d): ' || v_pedidos_relacionados
    );
    
    -- Si hay muchos productos afectados, generar alerta
    IF v_productos_afectados > 20 THEN
        INSERT INTO log_triggers_masivos (
            trigger_name, tabla_afectada, operacion,
            registros_procesados, mensaje_resultado, datos_adicionales
        ) VALUES (
            'TRG_SINCRONIZACION_MASIVA_CATEGORIA', 'CATEGORIA', 'CAMBIO_MASIVO',
            v_productos_afectados, 
            'ALERTA: Cambio de categoría afecta muchos productos',
            'CATEGORIA_ANTERIOR: ' || :OLD.nombre ||
            ', CATEGORIA_NUEVA: ' || :NEW.nombre ||
            ', PRODUCTOS_IMPACTADOS: ' || v_productos_afectados
        );
    END IF;
    
    COMMIT;
    
EXCEPTION
    WHEN OTHERS THEN
        ROLLBACK;
END trg_sincronizacion_masiva_categoria;
/

-- =============================================
-- TRIGGER 5: Control de integridad masiva en eliminaciones
-- =============================================
CREATE OR REPLACE TRIGGER trg_control_eliminacion_masiva
    BEFORE DELETE ON categoria
    FOR EACH ROW
DECLARE
    v_productos_asociados NUMBER := 0;
    v_ventas_historicas NUMBER := 0;
    v_valor_inventario NUMBER := 0;
BEGIN
    -- Verificar productos asociados
    SELECT COUNT(*), NVL(SUM(stock * precio), 0)
    INTO v_productos_asociados, v_valor_inventario
    FROM producto
    WHERE id_categoria = :OLD.id_categoria;
    
    -- Verificar ventas históricas
    SELECT COUNT(DISTINCT p.id_pedido)
    INTO v_ventas_historicas
    FROM pedido p
    JOIN detalle_pedido dp ON p.id_pedido = dp.id_pedido
    JOIN producto pr ON dp.id_producto = pr.id_producto
    WHERE pr.id_categoria = :OLD.id_categoria;
    
    -- Impedir eliminación si hay datos relacionados críticos
    IF v_productos_asociados > 0 THEN
        -- Registrar intento de eliminación
        INSERT INTO log_triggers_masivos (
            trigger_name, tabla_afectada, operacion,
            registros_procesados, mensaje_resultado, datos_adicionales
        ) VALUES (
            'TRG_CONTROL_ELIMINACION_MASIVA', 'CATEGORIA', 'DELETE_BLOCKED',
            0, 
            'Eliminación BLOQUEADA - Categoría con productos asociados',
            'CATEGORIA: ' || :OLD.nombre ||
            ', PRODUCTOS_ASOCIADOS: ' || v_productos_asociados ||
            ', VALOR_INVENTARIO: $' || v_valor_inventario ||
            ', VENTAS_HISTORICAS: ' || v_ventas_historicas
        );
        
        RAISE_APPLICATION_ERROR(-20300, 
            'No se puede eliminar la categoría "' || :OLD.nombre || 
            '". Tiene ' || v_productos_asociados || ' productos asociados ' ||
            'con valor de inventario: $' || TO_CHAR(v_valor_inventario, '999,999,999') ||
            ' y ' || v_ventas_historicas || ' pedidos históricos.');
    END IF;
    
    -- Si no hay impedimentos, registrar eliminación autorizada
    INSERT INTO auditoria_cambios_masivos (
        tabla_afectada, tipo_operacion, usuario_bd,
        cantidad_registros, detalles_cambio
    ) VALUES (
        'CATEGORIA', 'DELETE_AUTORIZADO', USER, 1,
        'Eliminación autorizada de categoría: ' || :OLD.nombre ||
        ' (Sin productos ni ventas asociadas)'
    );
    
EXCEPTION
    WHEN OTHERS THEN
        -- Log del error pero permitir que se propague
        INSERT INTO log_triggers_masivos (
            trigger_name, tabla_afectada, operacion,
            registros_procesados, mensaje_resultado
        ) VALUES (
            'TRG_CONTROL_ELIMINACION_MASIVA', 'CATEGORIA', 'ERROR',
            0, 'ERROR en validación de eliminación: ' || SQLERRM
        );
        RAISE;
END trg_control_eliminacion_masiva;
/

-- =============================================
-- TRIGGER 6: Optimización automática de rendimiento
-- =============================================
CREATE OR REPLACE TRIGGER trg_optimizacion_rendimiento
    AFTER INSERT ON detalle_pedido
    FOR EACH ROW
DECLARE
    PRAGMA AUTONOMOUS_TRANSACTION;
    v_total_inserciones NUMBER := 0;
    v_tiempo_respuesta NUMBER;
    v_estadisticas_producto CLOB;
BEGIN
    -- Contar inserciones recientes para detectar carga masiva
    SELECT COUNT(*)
    INTO v_total_inserciones
    FROM detalle_pedido
    WHERE id_pedido = :NEW.id_pedido;
    
    -- Si es una inserción masiva (más de 10 items), optimizar
    IF v_total_inserciones > 10 THEN
        
        -- Recopilar estadísticas del producto para optimización
        SELECT 'PRODUCTO_ID: ' || p.id_producto ||
               ', STOCK_ACTUAL: ' || p.stock ||
               ', VENTAS_RECIENTES: ' || (
                   SELECT COUNT(*) FROM detalle_pedido dp2 
                   JOIN pedido pe2 ON dp2.id_pedido = pe2.id_pedido
                   WHERE dp2.id_producto = p.id_producto 
                   AND pe2.fecha_pedido >= SYSDATE - 30
               ) ||
               ', CATEGORIA: ' || c.nombre
        INTO v_estadisticas_producto
        FROM producto p
        JOIN categoria c ON p.id_categoria = c.id_categoria
        WHERE p.id_producto = :NEW.id_producto;
        
        -- Registrar evento de carga masiva
        INSERT INTO log_triggers_masivos (
            trigger_name, tabla_afectada, operacion,
            registros_procesados, mensaje_resultado, datos_adicionales
        ) VALUES (
            'TRG_OPTIMIZACION_RENDIMIENTO', 'DETALLE_PEDIDO', 'CARGA_MASIVA',
            v_total_inserciones,
            'Detectada inserción masiva - Pedido: ' || :NEW.id_pedido,
            v_estadisticas_producto
        );
        
        -- Sugerir optimizaciones si el pedido es muy grande
        IF v_total_inserciones > 50 THEN
            INSERT INTO log_triggers_masivos (
                trigger_name, tabla_afectada, operacion,
                registros_procesados, mensaje_resultado, datos_adicionales
            ) VALUES (
                'TRG_OPTIMIZACION_RENDIMIENTO', 'DETALLE_PEDIDO', 'SUGERENCIA_OPTIMIZACION',
                v_total_inserciones,
                'PEDIDO MASIVO - Considerar procesamiento batch',
                'ITEMS: ' || v_total_inserciones || ', RECOMENDACION: Usar BULK COLLECT'
            );
        END IF;
    END IF;
    
    COMMIT;
    
EXCEPTION
    WHEN OTHERS THEN
        ROLLBACK;
END trg_optimizacion_rendimiento;
/

-- =============================================
-- PROCEDURES PARA CONSULTAR LOGS DE TRIGGERS
-- =============================================

-- Procedimiento para ver resumen de actividad de triggers
CREATE OR REPLACE PROCEDURE sp_resumen_actividad_triggers (
    p_dias_atras IN NUMBER DEFAULT 1,
    p_trigger_name IN VARCHAR2 DEFAULT NULL
)
IS
    v_fecha_limite DATE := SYSDATE - p_dias_atras;
    
    CURSOR cur_actividad IS
        SELECT 
            trigger_name,
            tabla_afectada,
            operacion,
            COUNT(*) as total_ejecuciones,
            SUM(registros_procesados) as total_registros,
            AVG(tiempo_ejecucion_ms) as tiempo_promedio,
            MAX(fecha_ejecucion) as ultima_ejecucion
        FROM log_triggers_masivos
        WHERE fecha_ejecucion >= v_fecha_limite
        AND (p_trigger_name IS NULL OR trigger_name = p_trigger_name)
        GROUP BY trigger_name, tabla_afectada, operacion
        ORDER BY total_ejecuciones DESC;
        
BEGIN
    DBMS_OUTPUT.PUT_LINE('=== RESUMEN DE ACTIVIDAD DE TRIGGERS ===');
    DBMS_OUTPUT.PUT_LINE('Periodo: Últimos ' || p_dias_atras || ' días');
    DBMS_OUTPUT.PUT_LINE('Desde: ' || TO_CHAR(v_fecha_limite, 'DD/MM/YYYY HH24:MI'));
    DBMS_OUTPUT.PUT_LINE('');
    
    DBMS_OUTPUT.PUT_LINE(RPAD('Trigger', 35) || ' | ' ||
                        RPAD('Tabla', 15) || ' | ' ||
                        RPAD('Operación', 15) || ' | ' ||
                        RPAD('Ejecuc.', 8) || ' | ' ||
                        RPAD('Registros', 10) || ' | ' ||
                        'Últ. Ejecución');
    DBMS_OUTPUT.PUT_LINE(RPAD('-', 35, '-') || '-+-' ||
                        RPAD('-', 15, '-') || '-+-' ||
                        RPAD('-', 15, '-') || '-+-' ||
                        RPAD('-', 8, '-') || '-+-' ||
                        RPAD('-', 10, '-') || '-+-' ||
                        RPAD('-', 20, '-'));
    
    FOR rec IN cur_actividad LOOP
        DBMS_OUTPUT.PUT_LINE(
            RPAD(SUBSTR(rec.trigger_name, 1, 34), 35) || ' | ' ||
            RPAD(SUBSTR(rec.tabla_afectada, 1, 14), 15) || ' | ' ||
            RPAD(SUBSTR(rec.operacion, 1, 14), 15) || ' | ' ||
            LPAD(rec.total_ejecuciones, 8) || ' | ' ||
            LPAD(rec.total_registros, 10) || ' | ' ||
            TO_CHAR(rec.ultima_ejecucion, 'DD/MM HH24:MI')
        );
    END LOOP;
    
    DBMS_OUTPUT.PUT_LINE('');
    DBMS_OUTPUT.PUT_LINE('=== FIN DEL RESUMEN ===');
    
END sp_resumen_actividad_triggers;
/

-- Procedimiento para ver alertas críticas de los últimos días
CREATE OR REPLACE PROCEDURE sp_alertas_criticas_triggers (
    p_dias_atras IN NUMBER DEFAULT 3
)
IS
    CURSOR cur_alertas IS
        SELECT 
            fecha_ejecucion,
            trigger_name,
            tabla_afectada,
            mensaje_resultado,
            datos_adicionales
        FROM log_triggers_masivos
        WHERE fecha_ejecucion >= SYSDATE - p_dias_atras
        AND (UPPER(mensaje_resultado) LIKE '%CRÍTICO%' 
             OR UPPER(mensaje_resultado) LIKE '%ERROR%'
             OR UPPER(mensaje_resultado) LIKE '%ALERTA%'
             OR UPPER(mensaje_resultado) LIKE '%BLOQUEADA%')
        ORDER BY fecha_ejecucion DESC;
        
BEGIN
    DBMS_OUTPUT.PUT_LINE('=== ALERTAS CRÍTICAS DE TRIGGERS ===');
    DBMS_OUTPUT.PUT_LINE('Últimos ' || p_dias_atras || ' días');
    DBMS_OUTPUT.PUT_LINE('');
    
    FOR rec IN cur_alertas LOOP
        DBMS_OUTPUT.PUT_LINE('Fecha: ' || TO_CHAR(rec.fecha_ejecucion, 'DD/MM/YYYY HH24:MI:SS'));
        DBMS_OUTPUT.PUT_LINE('Trigger: ' || rec.trigger_name);
        DBMS_OUTPUT.PUT_LINE('Tabla: ' || rec.tabla_afectada);
        DBMS_OUTPUT.PUT_LINE('Mensaje: ' || rec.mensaje_resultado);
        IF rec.datos_adicionales IS NOT NULL THEN
            DBMS_OUTPUT.PUT_LINE('Detalles: ' || SUBSTR(rec.datos_adicionales, 1, 200));
        END IF;
        DBMS_OUTPUT.PUT_LINE(RPAD('-', 60, '-'));
    END LOOP;
    
END sp_alertas_criticas_triggers;
/

-- =============================================
-- EJEMPLOS DE USO Y PRUEBAS
-- =============================================

-- Procedimiento para demostrar el funcionamiento de los triggers masivos
CREATE OR REPLACE PROCEDURE sp_demo_triggers_masivos
IS
    v_id_producto NUMBER;
    v_id_pedido NUMBER;
BEGIN
    DBMS_OUTPUT.PUT_LINE('=== DEMOSTRACIÓN DE TRIGGERS MASIVOS ===');
    
    -- 1. Probar trigger de auditoría de productos
    DBMS_OUTPUT.PUT_LINE('1. Creando producto de prueba...');
    INSERT INTO producto (id_producto, nombre, descripcion, precio, stock, id_categoria, esta_activo)
    VALUES (9999, 'Producto de Prueba Triggers', 'Para demostración', 50.00, 5, 1, 'S');
    
    -- 2. Probar trigger de control de stock (stock bajo)
    DBMS_OUTPUT.PUT_LINE('2. Actualizando stock a nivel bajo...');
    UPDATE producto SET stock = 2 WHERE id_producto = 9999;
    
    -- 3. Probar trigger de stock crítico (stock = 0)
    DBMS_OUTPUT.PUT_LINE('3. Agotando stock...');
    UPDATE producto SET stock = 0 WHERE id_producto = 9999;
    
    -- 4. Crear pedido para probar trigger de procesamiento
    DBMS_OUTPUT.PUT_LINE('4. Creando pedido de prueba...');
    SELECT NVL(MAX(id_pedido), 0) + 1 INTO v_id_pedido FROM pedido;
    
    INSERT INTO pedido (id_pedido, id_usuario, total, estado_pedido_id_estado, fecha_pedido)
    VALUES (v_id_pedido, 1, 150.00, 1, SYSDATE);
    
    -- 5. Agregar detalles del pedido
    DBMS_OUTPUT.PUT_LINE('5. Agregando detalles del pedido...');
    INSERT INTO detalle_pedido (id_detalle, id_pedido, id_producto, cantidad, precio_unitario)
    VALUES (v_id_pedido * 100, v_id_pedido, 1, 3, 50.00);
    
    -- 6. Ver resumen de actividad
    DBMS_OUTPUT.PUT_LINE('6. Resumen de actividad de triggers:');
    sp_resumen_actividad_triggers(1);
    
    -- 7. Ver alertas críticas
    DBMS_OUTPUT.PUT_LINE('7. Alertas críticas:');
    sp_alertas_criticas_triggers(1);
    
    -- Limpiar datos de prueba
    DELETE FROM detalle_pedido WHERE id_pedido = v_id_pedido;
    DELETE FROM pedido WHERE id_pedido = v_id_pedido;
    DELETE FROM producto WHERE id_producto = 9999;
    
    COMMIT;
    
    DBMS_OUTPUT.PUT_LINE('=== FIN DE LA DEMOSTRACIÓN ===');
    
EXCEPTION
    WHEN OTHERS THEN
        ROLLBACK;
        DBMS_OUTPUT.PUT_LINE('ERROR en demostración: ' || SQLERRM);
END sp_demo_triggers_masivos;
/

COMMIT;

-- =============================================
-- FIN DEL ARCHIVO DE TRIGGERS MASIVOS
-- =============================================