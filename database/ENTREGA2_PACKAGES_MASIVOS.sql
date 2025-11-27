-- =============================================
-- ENTREGA 2: PACKAGES PARA PROCESAMIENTO MASIVO
-- Sistema HuertoHogar - Implementación Avanzada PL/SQL
-- =============================================

-- =============================================
-- PACKAGE 1: GESTIÓN MASIVA DE INVENTARIO
-- =============================================

-- ESPECIFICACIÓN DEL PACKAGE
CREATE OR REPLACE PACKAGE pkg_gestion_inventario_masivo AS
    
    -- Tipos de datos compuestos
    TYPE t_producto_record IS RECORD (
        id_producto NUMBER,
        nombre VARCHAR2(100),
        precio NUMBER(10,2),
        stock NUMBER,
        categoria VARCHAR2(50)
    );
    
    TYPE t_productos_table IS TABLE OF t_producto_record INDEX BY PLS_INTEGER;
    
    TYPE t_reporte_inventario IS RECORD (
        total_productos NUMBER,
        valor_total_inventario NUMBER,
        productos_bajo_stock NUMBER,
        productos_sin_stock NUMBER,
        categorias_afectadas NUMBER
    );
    
    -- Procedimientos públicos
    PROCEDURE procesar_inventario_completo(
        p_aplicar_ajustes IN BOOLEAN DEFAULT FALSE
    );
    
    PROCEDURE actualizar_precios_categoria(
        p_id_categoria IN NUMBER,
        p_porcentaje_ajuste IN NUMBER,
        p_productos_afectados OUT NUMBER
    );
    
    PROCEDURE restock_masivo_categoria(
        p_id_categoria IN NUMBER,
        p_cantidad_base IN NUMBER,
        p_metodo IN VARCHAR2 DEFAULT 'FIJO' -- 'FIJO', 'PORCENTUAL', 'INTELIGENTE'
    );
    
    -- Funciones públicas
    FUNCTION obtener_reporte_inventario RETURN t_reporte_inventario;
    
    FUNCTION calcular_valor_inventario_categoria(
        p_id_categoria IN NUMBER
    ) RETURN NUMBER;
    
    FUNCTION obtener_productos_criticos(
        p_umbral_stock IN NUMBER DEFAULT 10
    ) RETURN t_productos_table PIPELINED;
    
    -- Variables públicas (constantes)
    c_stock_minimo CONSTANT NUMBER := 5;
    c_ajuste_maximo CONSTANT NUMBER := 50; -- Máximo 50% de ajuste
    
END pkg_gestion_inventario_masivo;
/

-- CUERPO DEL PACKAGE
CREATE OR REPLACE PACKAGE BODY pkg_gestion_inventario_masivo AS
    
    -- Variables privadas
    g_log_activado BOOLEAN := TRUE;
    g_ultimo_procesamiento DATE;
    
    -- Procedimientos y funciones privadas
    PROCEDURE log_mensaje(p_mensaje IN VARCHAR2) IS
    BEGIN
        IF g_log_activado THEN
            DBMS_OUTPUT.PUT_LINE(TO_CHAR(SYSDATE, 'HH24:MI:SS') || ' - ' || p_mensaje);
        END IF;
    END log_mensaje;
    
    FUNCTION validar_categoria(p_id_categoria IN NUMBER) RETURN BOOLEAN IS
        v_existe NUMBER := 0;
    BEGIN
        SELECT COUNT(*)
        INTO v_existe
        FROM categoria
        WHERE id_categoria = p_id_categoria;
        
        RETURN v_existe > 0;
    END validar_categoria;
    
    -- Implementación de procedimientos públicos
    PROCEDURE procesar_inventario_completo(
        p_aplicar_ajustes IN BOOLEAN DEFAULT FALSE
    ) IS
        v_productos_procesados NUMBER := 0;
        v_ajustes_aplicados NUMBER := 0;
        
        CURSOR cur_productos_todos IS
            SELECT p.id_producto, p.nombre, p.precio, p.stock, p.id_categoria, c.nombre as categoria_nombre
            FROM producto p
            JOIN categoria c ON p.id_categoria = c.id_categoria
            WHERE p.esta_activo = 'S'
            ORDER BY c.nombre, p.nombre;
            
    BEGIN
        log_mensaje('=== INICIO PROCESAMIENTO MASIVO DE INVENTARIO ===');
        g_ultimo_procesamiento := SYSDATE;
        
        FOR rec IN cur_productos_todos LOOP
            -- Verificar stock crítico
            IF rec.stock <= c_stock_minimo THEN
                log_mensaje('ALERTA: Producto ' || rec.nombre || ' con stock crítico: ' || rec.stock);
                
                IF p_aplicar_ajustes THEN
                    -- Aplicar restock automático
                    UPDATE producto
                    SET stock = stock + 50, -- Agregar 50 unidades
                        fecha_actualizacion = SYSDATE
                    WHERE id_producto = rec.id_producto;
                    
                    v_ajustes_aplicados := v_ajustes_aplicados + 1;
                    log_mensaje('Restock aplicado a: ' || rec.nombre);
                END IF;
            END IF;
            
            -- Validar precios
            IF rec.precio <= 0 THEN
                log_mensaje('ERROR: Producto ' || rec.nombre || ' con precio inválido: ' || rec.precio);
            END IF;
            
            v_productos_procesados := v_productos_procesados + 1;
        END LOOP;
        
        IF p_aplicar_ajustes THEN
            COMMIT;
        END IF;
        
        log_mensaje('Productos procesados: ' || v_productos_procesados);
        log_mensaje('Ajustes aplicados: ' || v_ajustes_aplicados);
        log_mensaje('=== FIN PROCESAMIENTO MASIVO ===');
        
    EXCEPTION
        WHEN OTHERS THEN
            IF p_aplicar_ajustes THEN
                ROLLBACK;
            END IF;
            log_mensaje('ERROR EN PROCESAMIENTO: ' || SQLERRM);
            RAISE;
    END procesar_inventario_completo;
    
    PROCEDURE actualizar_precios_categoria(
        p_id_categoria IN NUMBER,
        p_porcentaje_ajuste IN NUMBER,
        p_productos_afectados OUT NUMBER
    ) IS
        v_ajuste_real NUMBER;
    BEGIN
        log_mensaje('Actualizando precios categoría: ' || p_id_categoria);
        
        -- Validar categoría
        IF NOT validar_categoria(p_id_categoria) THEN
            RAISE_APPLICATION_ERROR(-20200, 'Categoría no válida: ' || p_id_categoria);
        END IF;
        
        -- Limitar ajuste máximo
        v_ajuste_real := CASE 
            WHEN ABS(p_porcentaje_ajuste) > c_ajuste_maximo THEN 
                SIGN(p_porcentaje_ajuste) * c_ajuste_maximo
            ELSE p_porcentaje_ajuste
        END;
        
        -- Actualización masiva
        UPDATE producto
        SET precio = precio * (1 + v_ajuste_real/100),
            fecha_actualizacion = SYSDATE
        WHERE id_categoria = p_id_categoria
        AND esta_activo = 'S';
        
        p_productos_afectados := SQL%ROWCOUNT;
        
        log_mensaje('Productos actualizados: ' || p_productos_afectados || 
                   ' con ajuste del ' || v_ajuste_real || '%');
        
        COMMIT;
        
    EXCEPTION
        WHEN OTHERS THEN
            ROLLBACK;
            p_productos_afectados := 0;
            RAISE;
    END actualizar_precios_categoria;
    
    PROCEDURE restock_masivo_categoria(
        p_id_categoria IN NUMBER,
        p_cantidad_base IN NUMBER,
        p_metodo IN VARCHAR2 DEFAULT 'FIJO'
    ) IS
        v_productos_actualizados NUMBER := 0;
        
        CURSOR cur_productos_categoria IS
            SELECT id_producto, nombre, stock, precio
            FROM producto
            WHERE id_categoria = p_id_categoria
            AND esta_activo = 'S'
            ORDER BY stock ASC; -- Priorizar productos con menos stock
            
    BEGIN
        log_mensaje('Restock masivo categoría: ' || p_id_categoria || ' - Método: ' || p_metodo);
        
        FOR rec IN cur_productos_categoria LOOP
            DECLARE
                v_cantidad_restock NUMBER;
            BEGIN
                CASE p_metodo
                    WHEN 'FIJO' THEN
                        v_cantidad_restock := p_cantidad_base;
                        
                    WHEN 'PORCENTUAL' THEN
                        v_cantidad_restock := GREATEST(
                            ROUND(rec.stock * p_cantidad_base/100), 
                            10 -- Mínimo 10 unidades
                        );
                        
                    WHEN 'INTELIGENTE' THEN
                        -- Basado en precio y stock actual
                        IF rec.precio > 100 THEN
                            v_cantidad_restock := ROUND(p_cantidad_base * 0.5); -- Productos caros menos stock
                        ELSIF rec.stock < 5 THEN
                            v_cantidad_restock := p_cantidad_base * 2; -- Stock crítico más reposición
                        ELSE
                            v_cantidad_restock := p_cantidad_base;
                        END IF;
                END CASE;
                
                -- Aplicar restock
                UPDATE producto
                SET stock = stock + v_cantidad_restock,
                    fecha_actualizacion = SYSDATE
                WHERE id_producto = rec.id_producto;
                
                v_productos_actualizados := v_productos_actualizados + 1;
                
                log_mensaje('Producto: ' || rec.nombre || 
                           ' - Stock anterior: ' || rec.stock ||
                           ' - Agregado: ' || v_cantidad_restock);
            END;
        END LOOP;
        
        COMMIT;
        log_mensaje('Total productos actualizados: ' || v_productos_actualizados);
        
    EXCEPTION
        WHEN OTHERS THEN
            ROLLBACK;
            RAISE;
    END restock_masivo_categoria;
    
    -- Implementación de funciones públicas
    FUNCTION obtener_reporte_inventario RETURN t_reporte_inventario IS
        v_reporte t_reporte_inventario;
    BEGIN
        SELECT 
            COUNT(*) as total_productos,
            SUM(precio * stock) as valor_total,
            SUM(CASE WHEN stock <= c_stock_minimo THEN 1 ELSE 0 END) as bajo_stock,
            SUM(CASE WHEN stock = 0 THEN 1 ELSE 0 END) as sin_stock,
            COUNT(DISTINCT id_categoria) as categorias
        INTO 
            v_reporte.total_productos,
            v_reporte.valor_total_inventario,
            v_reporte.productos_bajo_stock,
            v_reporte.productos_sin_stock,
            v_reporte.categorias_afectadas
        FROM producto
        WHERE esta_activo = 'S';
        
        RETURN v_reporte;
        
    EXCEPTION
        WHEN OTHERS THEN
            v_reporte.total_productos := 0;
            v_reporte.valor_total_inventario := 0;
            v_reporte.productos_bajo_stock := 0;
            v_reporte.productos_sin_stock := 0;
            v_reporte.categorias_afectadas := 0;
            RETURN v_reporte;
    END obtener_reporte_inventario;
    
    FUNCTION calcular_valor_inventario_categoria(
        p_id_categoria IN NUMBER
    ) RETURN NUMBER IS
        v_valor_total NUMBER := 0;
    BEGIN
        SELECT NVL(SUM(precio * stock), 0)
        INTO v_valor_total
        FROM producto
        WHERE id_categoria = p_id_categoria
        AND esta_activo = 'S';
        
        RETURN v_valor_total;
        
    EXCEPTION
        WHEN OTHERS THEN
            RETURN 0;
    END calcular_valor_inventario_categoria;
    
    FUNCTION obtener_productos_criticos(
        p_umbral_stock IN NUMBER DEFAULT 10
    ) RETURN t_productos_table PIPELINED IS
        
        CURSOR cur_productos_criticos IS
            SELECT p.id_producto, p.nombre, p.precio, p.stock, c.nombre as categoria
            FROM producto p
            JOIN categoria c ON p.id_categoria = c.id_categoria
            WHERE p.stock <= p_umbral_stock
            AND p.esta_activo = 'S'
            ORDER BY p.stock ASC, p.precio DESC;
            
        v_producto t_producto_record;
    BEGIN
        FOR rec IN cur_productos_criticos LOOP
            v_producto.id_producto := rec.id_producto;
            v_producto.nombre := rec.nombre;
            v_producto.precio := rec.precio;
            v_producto.stock := rec.stock;
            v_producto.categoria := rec.categoria;
            
            PIPE ROW(v_producto);
        END LOOP;
        
        RETURN;
    END obtener_productos_criticos;
    
END pkg_gestion_inventario_masivo;
/

-- =============================================
-- PACKAGE 2: ANÁLISIS Y REPORTES MASIVOS
-- =============================================

CREATE OR REPLACE PACKAGE pkg_reportes_masivos AS
    
    -- Tipos de datos para reportes
    TYPE t_reporte_ventas IS RECORD (
        periodo VARCHAR2(20),
        total_ventas NUMBER,
        cantidad_pedidos NUMBER,
        ticket_promedio NUMBER,
        productos_vendidos NUMBER
    );
    
    TYPE t_tabla_reportes IS TABLE OF t_reporte_ventas INDEX BY PLS_INTEGER;
    
    TYPE t_producto_top IS RECORD (
        id_producto NUMBER,
        nombre_producto VARCHAR2(100),
        categoria VARCHAR2(50),
        cantidad_vendida NUMBER,
        ingresos_generados NUMBER,
        ranking NUMBER
    );
    
    TYPE t_tabla_productos_top IS TABLE OF t_producto_top INDEX BY PLS_INTEGER;
    
    -- Procedimientos para reportes masivos
    PROCEDURE generar_reporte_ventas_anual(
        p_anio IN NUMBER DEFAULT EXTRACT(YEAR FROM SYSDATE)
    );
    
    PROCEDURE procesar_kpis_categorias(
        p_meses_atras IN NUMBER DEFAULT 6
    );
    
    -- Funciones para análisis masivo
    FUNCTION obtener_reportes_trimestrales(
        p_anio IN NUMBER
    ) RETURN t_tabla_reportes;
    
    FUNCTION obtener_productos_top(
        p_limite IN NUMBER DEFAULT 10,
        p_periodo_meses IN NUMBER DEFAULT 3
    ) RETURN t_tabla_productos_top;
    
    FUNCTION calcular_tendencia_ventas(
        p_id_categoria IN NUMBER,
        p_meses_analisis IN NUMBER DEFAULT 12
    ) RETURN VARCHAR2; -- 'CRECIENTE', 'DECRECIENTE', 'ESTABLE'
    
END pkg_reportes_masivos;
/

CREATE OR REPLACE PACKAGE BODY pkg_reportes_masivos AS
    
    -- Variables privadas del package
    g_formato_fecha CONSTANT VARCHAR2(20) := 'DD/MM/YYYY';
    g_precision_calculo CONSTANT NUMBER := 2;
    
    -- Función privada para formatear números
    FUNCTION formatear_numero(p_numero IN NUMBER) RETURN VARCHAR2 IS
    BEGIN
        RETURN TO_CHAR(p_numero, '999,999,999.00');
    END formatear_numero;
    
    -- Implementación de procedimientos
    PROCEDURE generar_reporte_ventas_anual(
        p_anio IN NUMBER DEFAULT EXTRACT(YEAR FROM SYSDATE)
    ) IS
        v_ventas_totales NUMBER := 0;
        v_pedidos_totales NUMBER := 0;
        v_mes_actual NUMBER;
        
        CURSOR cur_ventas_mensual IS
            SELECT 
                EXTRACT(MONTH FROM p.fecha_pedido) as mes,
                COUNT(*) as pedidos,
                SUM(p.total) as ventas,
                AVG(p.total) as ticket_promedio
            FROM pedido p
            WHERE EXTRACT(YEAR FROM p.fecha_pedido) = p_anio
            AND p.estado_pedido_id_estado = 4 -- Entregados
            GROUP BY EXTRACT(MONTH FROM p.fecha_pedido)
            ORDER BY mes;
    BEGIN
        DBMS_OUTPUT.PUT_LINE('===============================================');
        DBMS_OUTPUT.PUT_LINE('     REPORTE ANUAL DE VENTAS - ' || p_anio);
        DBMS_OUTPUT.PUT_LINE('===============================================');
        DBMS_OUTPUT.PUT_LINE('Mes        | Pedidos | Ventas      | Ticket Prom.');
        DBMS_OUTPUT.PUT_LINE('-----------|---------|-------------|-------------');
        
        FOR rec IN cur_ventas_mensual LOOP
            DBMS_OUTPUT.PUT_LINE(
                RPAD(TO_CHAR(TO_DATE(rec.mes, 'MM'), 'MONTH'), 10) || ' | ' ||
                LPAD(rec.pedidos, 7) || ' | ' ||
                LPAD(formatear_numero(rec.ventas), 11) || ' | ' ||
                LPAD(formatear_numero(rec.ticket_promedio), 11)
            );
            
            v_ventas_totales := v_ventas_totales + rec.ventas;
            v_pedidos_totales := v_pedidos_totales + rec.pedidos;
        END LOOP;
        
        DBMS_OUTPUT.PUT_LINE('-----------|---------|-------------|-------------');
        DBMS_OUTPUT.PUT_LINE('TOTALES    | ' || 
                           LPAD(v_pedidos_totales, 7) || ' | ' ||
                           LPAD(formatear_numero(v_ventas_totales), 11) || ' | ' ||
                           LPAD(formatear_numero(v_ventas_totales/GREATEST(v_pedidos_totales,1)), 11));
        DBMS_OUTPUT.PUT_LINE('===============================================');
        
    EXCEPTION
        WHEN OTHERS THEN
            DBMS_OUTPUT.PUT_LINE('ERROR generando reporte: ' || SQLERRM);
    END generar_reporte_ventas_anual;
    
    PROCEDURE procesar_kpis_categorias(
        p_meses_atras IN NUMBER DEFAULT 6
    ) IS
        v_fecha_limite DATE := ADD_MONTHS(SYSDATE, -p_meses_atras);
        
        CURSOR cur_kpis_categoria IS
            SELECT 
                c.id_categoria,
                c.nombre as categoria_nombre,
                COUNT(DISTINCT p.id_producto) as productos_activos,
                NVL(SUM(dp.cantidad), 0) as unidades_vendidas,
                NVL(SUM(dp.cantidad * dp.precio_unitario), 0) as ingresos,
                COUNT(DISTINCT pe.id_pedido) as pedidos_categoria
            FROM categoria c
            LEFT JOIN producto p ON c.id_categoria = p.id_categoria AND p.esta_activo = 'S'
            LEFT JOIN detalle_pedido dp ON p.id_producto = dp.id_producto
            LEFT JOIN pedido pe ON dp.id_pedido = pe.id_pedido AND pe.fecha_pedido >= v_fecha_limite
            GROUP BY c.id_categoria, c.nombre
            ORDER BY ingresos DESC;
            
    BEGIN
        DBMS_OUTPUT.PUT_LINE('=== KPIs POR CATEGORÍA (Últimos ' || p_meses_atras || ' meses) ===');
        
        FOR rec IN cur_kpis_categoria LOOP
            DBMS_OUTPUT.PUT_LINE('--- ' || UPPER(rec.categoria_nombre) || ' ---');
            DBMS_OUTPUT.PUT_LINE('Productos activos: ' || rec.productos_activos);
            DBMS_OUTPUT.PUT_LINE('Unidades vendidas: ' || rec.unidades_vendidas);
            DBMS_OUTPUT.PUT_LINE('Ingresos generados: $' || formatear_numero(rec.ingresos));
            DBMS_OUTPUT.PUT_LINE('Pedidos de la categoría: ' || rec.pedidos_categoria);
            
            -- Calcular ratios
            IF rec.productos_activos > 0 THEN
                DBMS_OUTPUT.PUT_LINE('Promedio ventas/producto: $' || 
                    formatear_numero(rec.ingresos / rec.productos_activos));
            END IF;
            
            IF rec.pedidos_categoria > 0 THEN
                DBMS_OUTPUT.PUT_LINE('Valor promedio/pedido: $' || 
                    formatear_numero(rec.ingresos / rec.pedidos_categoria));
            END IF;
            
            DBMS_OUTPUT.PUT_LINE('');
        END LOOP;
        
    EXCEPTION
        WHEN OTHERS THEN
            DBMS_OUTPUT.PUT_LINE('ERROR procesando KPIs: ' || SQLERRM);
    END procesar_kpis_categorias;
    
    -- Implementación de funciones
    FUNCTION obtener_reportes_trimestrales(
        p_anio IN NUMBER
    ) RETURN t_tabla_reportes IS
        v_reportes t_tabla_reportes;
        v_indice NUMBER := 1;
        
        CURSOR cur_trimestres IS
            SELECT 
                'Q' || CEIL(EXTRACT(MONTH FROM p.fecha_pedido)/3) as trimestre,
                COUNT(*) as pedidos,
                SUM(p.total) as ventas,
                AVG(p.total) as ticket_promedio,
                SUM(dp.cantidad) as productos_vendidos
            FROM pedido p
            JOIN detalle_pedido dp ON p.id_pedido = dp.id_pedido
            WHERE EXTRACT(YEAR FROM p.fecha_pedido) = p_anio
            AND p.estado_pedido_id_estado = 4
            GROUP BY CEIL(EXTRACT(MONTH FROM p.fecha_pedido)/3)
            ORDER BY CEIL(EXTRACT(MONTH FROM p.fecha_pedido)/3);
            
    BEGIN
        FOR rec IN cur_trimestres LOOP
            v_reportes(v_indice).periodo := rec.trimestre;
            v_reportes(v_indice).total_ventas := rec.ventas;
            v_reportes(v_indice).cantidad_pedidos := rec.pedidos;
            v_reportes(v_indice).ticket_promedio := rec.ticket_promedio;
            v_reportes(v_indice).productos_vendidos := rec.productos_vendidos;
            
            v_indice := v_indice + 1;
        END LOOP;
        
        RETURN v_reportes;
        
    EXCEPTION
        WHEN OTHERS THEN
            RETURN v_reportes;
    END obtener_reportes_trimestrales;
    
    FUNCTION obtener_productos_top(
        p_limite IN NUMBER DEFAULT 10,
        p_periodo_meses IN NUMBER DEFAULT 3
    ) RETURN t_tabla_productos_top IS
        v_productos t_tabla_productos_top;
        v_indice NUMBER := 1;
        v_fecha_limite DATE := ADD_MONTHS(SYSDATE, -p_periodo_meses);
        
        CURSOR cur_productos_top IS
            SELECT 
                p.id_producto,
                p.nombre,
                c.nombre as categoria,
                SUM(dp.cantidad) as cantidad_total,
                SUM(dp.cantidad * dp.precio_unitario) as ingresos_total,
                ROW_NUMBER() OVER (ORDER BY SUM(dp.cantidad * dp.precio_unitario) DESC) as ranking
            FROM producto p
            JOIN categoria c ON p.id_categoria = c.id_categoria
            JOIN detalle_pedido dp ON p.id_producto = dp.id_producto
            JOIN pedido pe ON dp.id_pedido = pe.id_pedido
            WHERE pe.fecha_pedido >= v_fecha_limite
            AND pe.estado_pedido_id_estado = 4
            GROUP BY p.id_producto, p.nombre, c.nombre
            ORDER BY ingresos_total DESC;
            
    BEGIN
        FOR rec IN cur_productos_top LOOP
            EXIT WHEN v_indice > p_limite;
            
            v_productos(v_indice).id_producto := rec.id_producto;
            v_productos(v_indice).nombre_producto := rec.nombre;
            v_productos(v_indice).categoria := rec.categoria;
            v_productos(v_indice).cantidad_vendida := rec.cantidad_total;
            v_productos(v_indice).ingresos_generados := rec.ingresos_total;
            v_productos(v_indice).ranking := rec.ranking;
            
            v_indice := v_indice + 1;
        END LOOP;
        
        RETURN v_productos;
        
    EXCEPTION
        WHEN OTHERS THEN
            RETURN v_productos;
    END obtener_productos_top;
    
    FUNCTION calcular_tendencia_ventas(
        p_id_categoria IN NUMBER,
        p_meses_analisis IN NUMBER DEFAULT 12
    ) RETURN VARCHAR2 IS
        v_ventas_primer_trimestre NUMBER := 0;
        v_ventas_ultimo_trimestre NUMBER := 0;
        v_variacion_porcentual NUMBER;
    BEGIN
        -- Ventas del primer trimestre del periodo
        SELECT NVL(SUM(dp.cantidad * dp.precio_unitario), 0)
        INTO v_ventas_primer_trimestre
        FROM detalle_pedido dp
        JOIN producto pr ON dp.id_producto = pr.id_producto
        JOIN pedido p ON dp.id_pedido = p.id_pedido
        WHERE pr.id_categoria = p_id_categoria
        AND p.fecha_pedido BETWEEN ADD_MONTHS(SYSDATE, -p_meses_analisis) 
                                AND ADD_MONTHS(SYSDATE, -p_meses_analisis + 3)
        AND p.estado_pedido_id_estado = 4;
        
        -- Ventas del último trimestre
        SELECT NVL(SUM(dp.cantidad * dp.precio_unitario), 0)
        INTO v_ventas_ultimo_trimestre
        FROM detalle_pedido dp
        JOIN producto pr ON dp.id_producto = pr.id_producto
        JOIN pedido p ON dp.id_pedido = p.id_pedido
        WHERE pr.id_categoria = p_id_categoria
        AND p.fecha_pedido BETWEEN ADD_MONTHS(SYSDATE, -3) AND SYSDATE
        AND p.estado_pedido_id_estado = 4;
        
        -- Calcular tendencia
        IF v_ventas_primer_trimestre = 0 THEN
            RETURN 'SIN_DATOS';
        END IF;
        
        v_variacion_porcentual := ((v_ventas_ultimo_trimestre - v_ventas_primer_trimestre) / v_ventas_primer_trimestre) * 100;
        
        IF v_variacion_porcentual > 10 THEN
            RETURN 'CRECIENTE';
        ELSIF v_variacion_porcentual < -10 THEN
            RETURN 'DECRECIENTE';
        ELSE
            RETURN 'ESTABLE';
        END IF;
        
    EXCEPTION
        WHEN OTHERS THEN
            RETURN 'ERROR';
    END calcular_tendencia_ventas;
    
END pkg_reportes_masivos;
/

-- =============================================
-- EJEMPLOS DE USO DE LOS PACKAGES
-- =============================================

-- Script para demostrar el uso masivo de los packages
CREATE OR REPLACE PROCEDURE sp_demo_uso_packages_masivo
IS
    v_reporte pkg_gestion_inventario_masivo.t_reporte_inventario;
    v_productos_afectados NUMBER;
    v_reportes_trimestrales pkg_reportes_masivos.t_tabla_reportes;
    v_productos_top pkg_reportes_masivos.t_tabla_productos_top;
    v_indice PLS_INTEGER;
BEGIN
    DBMS_OUTPUT.PUT_LINE('========================================');
    DBMS_OUTPUT.PUT_LINE('   DEMOSTRACIÓN DE PACKAGES MASIVOS');
    DBMS_OUTPUT.PUT_LINE('========================================');
    
    -- 1. Usar package de inventario
    DBMS_OUTPUT.PUT_LINE('1. REPORTE DE INVENTARIO GENERAL:');
    v_reporte := pkg_gestion_inventario_masivo.obtener_reporte_inventario();
    
    DBMS_OUTPUT.PUT_LINE('   Total productos: ' || v_reporte.total_productos);
    DBMS_OUTPUT.PUT_LINE('   Valor inventario: $' || TO_CHAR(v_reporte.valor_total_inventario, '999,999,999'));
    DBMS_OUTPUT.PUT_LINE('   Productos bajo stock: ' || v_reporte.productos_bajo_stock);
    DBMS_OUTPUT.PUT_LINE('   Productos sin stock: ' || v_reporte.productos_sin_stock);
    
    -- 2. Procesamiento masivo de inventario
    DBMS_OUTPUT.PUT_LINE('');
    DBMS_OUTPUT.PUT_LINE('2. PROCESAMIENTO MASIVO DE INVENTARIO:');
    pkg_gestion_inventario_masivo.procesar_inventario_completo(FALSE);
    
    -- 3. Actualización masiva de precios
    DBMS_OUTPUT.PUT_LINE('');
    DBMS_OUTPUT.PUT_LINE('3. ACTUALIZACIÓN MASIVA DE PRECIOS (Categoría 1, +5%):');
    pkg_gestion_inventario_masivo.actualizar_precios_categoria(1, 5, v_productos_afectados);
    DBMS_OUTPUT.PUT_LINE('   Productos actualizados: ' || v_productos_afectados);
    
    -- 4. Restock masivo
    DBMS_OUTPUT.PUT_LINE('');
    DBMS_OUTPUT.PUT_LINE('4. RESTOCK MASIVO (Categoría 2, método INTELIGENTE):');
    pkg_gestion_inventario_masivo.restock_masivo_categoria(2, 25, 'INTELIGENTE');
    
    -- 5. Reportes masivos
    DBMS_OUTPUT.PUT_LINE('');
    DBMS_OUTPUT.PUT_LINE('5. REPORTE ANUAL DE VENTAS:');
    pkg_reportes_masivos.generar_reporte_ventas_anual(2024);
    
    -- 6. KPIs por categoría
    DBMS_OUTPUT.PUT_LINE('');
    DBMS_OUTPUT.PUT_LINE('6. KPIs POR CATEGORÍA:');
    pkg_reportes_masivos.procesar_kpis_categorias(3);
    
    -- 7. Productos TOP
    DBMS_OUTPUT.PUT_LINE('');
    DBMS_OUTPUT.PUT_LINE('7. TOP 5 PRODUCTOS:');
    v_productos_top := pkg_reportes_masivos.obtener_productos_top(5, 6);
    
    v_indice := v_productos_top.FIRST;
    WHILE v_indice IS NOT NULL LOOP
        DBMS_OUTPUT.PUT_LINE('   #' || v_productos_top(v_indice).ranking || 
                           ' - ' || v_productos_top(v_indice).nombre_producto ||
                           ' (' || v_productos_top(v_indice).categoria || ')' ||
                           ' - $' || TO_CHAR(v_productos_top(v_indice).ingresos_generados, '999,999'));
        v_indice := v_productos_top.NEXT(v_indice);
    END LOOP;
    
    -- 8. Análisis de tendencias
    DBMS_OUTPUT.PUT_LINE('');
    DBMS_OUTPUT.PUT_LINE('8. ANÁLISIS DE TENDENCIAS:');
    FOR i IN 1..4 LOOP
        DBMS_OUTPUT.PUT_LINE('   Categoría ' || i || ': ' || 
            pkg_reportes_masivos.calcular_tendencia_ventas(i, 12));
    END LOOP;
    
    DBMS_OUTPUT.PUT_LINE('========================================');
    
END sp_demo_uso_packages_masivo;
/

COMMIT;

-- =============================================
-- FIN DEL ARCHIVO DE PACKAGES MASIVOS
-- =============================================