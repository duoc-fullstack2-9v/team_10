-- =============================================
-- ENTREGA 2: PROCEDIMIENTOS Y FUNCIONES PARA PROCESAMIENTO MASIVO
-- Sistema HuertoHogar - Implementación Avanzada PL/SQL
-- =============================================

SET SERVEROUTPUT ON;

-- =============================================
-- 1. PROCEDIMIENTOS CON PARÁMETROS PARA PROCESAMIENTO MASIVO
-- =============================================

-- Procedimiento para procesar pedidos masivos (SIN parámetros - procesa todos los pendientes)
CREATE OR REPLACE PROCEDURE sp_procesar_pedidos_masivo
IS
    v_contador NUMBER := 0;
    v_total_procesado NUMBER := 0;
    
    -- Cursor para pedidos pendientes
    CURSOR cur_pedidos_pendientes IS
        SELECT id_pedido, id_usuario, total
        FROM pedido
        WHERE estado_pedido_id_estado = 1 -- Pendiente
        ORDER BY fecha_pedido;
        
BEGIN
    DBMS_OUTPUT.PUT_LINE('=== INICIO PROCESAMIENTO MASIVO DE PEDIDOS ===');
    DBMS_OUTPUT.PUT_LINE('Fecha: ' || TO_CHAR(SYSDATE, 'DD/MM/YYYY HH24:MI:SS'));
    
    FOR rec_pedido IN cur_pedidos_pendientes LOOP
        BEGIN
            -- Validar stock de todos los productos del pedido
            IF fn_validar_stock_pedido_completo(rec_pedido.id_pedido) = 1 THEN
                -- Actualizar estado a "En Proceso"
                UPDATE pedido 
                SET estado_pedido_id_estado = 2,
                    fecha_actualizacion = SYSDATE
                WHERE id_pedido = rec_pedido.id_pedido;
                
                -- Reducir stock de productos
                UPDATE producto p
                SET stock = stock - (
                    SELECT dp.cantidad 
                    FROM detalle_pedido dp 
                    WHERE dp.id_pedido = rec_pedido.id_pedido 
                    AND dp.id_producto = p.id_producto
                )
                WHERE EXISTS (
                    SELECT 1 FROM detalle_pedido dp 
                    WHERE dp.id_pedido = rec_pedido.id_pedido 
                    AND dp.id_producto = p.id_producto
                );
                
                v_contador := v_contador + 1;
                v_total_procesado := v_total_procesado + rec_pedido.total;
                
                DBMS_OUTPUT.PUT_LINE('Pedido ' || rec_pedido.id_pedido || ' procesado - Total: $' || rec_pedido.total);
            ELSE
                DBMS_OUTPUT.PUT_LINE('Pedido ' || rec_pedido.id_pedido || ' - Stock insuficiente');
            END IF;
            
        EXCEPTION
            WHEN OTHERS THEN
                DBMS_OUTPUT.PUT_LINE('Error procesando pedido ' || rec_pedido.id_pedido || ': ' || SQLERRM);
                ROLLBACK TO SAVEPOINT pedido_individual;
        END;
        
        SAVEPOINT pedido_individual;
    END LOOP;
    
    COMMIT;
    
    DBMS_OUTPUT.PUT_LINE('=== RESUMEN DE PROCESAMIENTO ===');
    DBMS_OUTPUT.PUT_LINE('Pedidos procesados: ' || v_contador);
    DBMS_OUTPUT.PUT_LINE('Total facturado: $' || TO_CHAR(v_total_procesado, '999,999,999'));
    DBMS_OUTPUT.PUT_LINE('=== FIN PROCESAMIENTO MASIVO ===');
    
EXCEPTION
    WHEN OTHERS THEN
        ROLLBACK;
        DBMS_OUTPUT.PUT_LINE('ERROR CRÍTICO: ' || SQLERRM);
        RAISE_APPLICATION_ERROR(-20100, 'Error en procesamiento masivo: ' || SQLERRM);
END sp_procesar_pedidos_masivo;
/

-- Procedimiento CON parámetros para procesar pedidos por fecha y usuario
CREATE OR REPLACE PROCEDURE sp_procesar_pedidos_periodo (
    p_fecha_desde IN DATE,
    p_fecha_hasta IN DATE,
    p_id_usuario IN NUMBER DEFAULT NULL,
    p_total_procesados OUT NUMBER,
    p_monto_total OUT NUMBER
)
IS
    v_contador NUMBER := 0;
    v_total NUMBER := 0;
    
    -- Cursor parametrizado para pedidos por periodo
    CURSOR cur_pedidos_periodo IS
        SELECT p.id_pedido, p.id_usuario, p.total, p.fecha_pedido
        FROM pedido p
        WHERE p.fecha_pedido BETWEEN p_fecha_desde AND p_fecha_hasta
        AND (p_id_usuario IS NULL OR p.id_usuario = p_id_usuario)
        AND p.estado_pedido_id_estado = 1
        ORDER BY p.fecha_pedido DESC;
        
BEGIN
    DBMS_OUTPUT.PUT_LINE('=== PROCESAMIENTO POR PERIODO ===');
    DBMS_OUTPUT.PUT_LINE('Desde: ' || TO_CHAR(p_fecha_desde, 'DD/MM/YYYY'));
    DBMS_OUTPUT.PUT_LINE('Hasta: ' || TO_CHAR(p_fecha_hasta, 'DD/MM/YYYY'));
    
    FOR rec IN cur_pedidos_periodo LOOP
        -- Llamar a procedimiento individual
        sp_actualizar_stock_venta_completa(rec.id_pedido);
        
        v_contador := v_contador + 1;
        v_total := v_total + rec.total;
        
        DBMS_OUTPUT.PUT_LINE('Procesado pedido: ' || rec.id_pedido || 
                           ' - Usuario: ' || rec.id_usuario || 
                           ' - Monto: $' || rec.total);
    END LOOP;
    
    -- Parámetros de salida
    p_total_procesados := v_contador;
    p_monto_total := v_total;
    
    COMMIT;
    DBMS_OUTPUT.PUT_LINE('Total procesados: ' || v_contador || ' pedidos');
    DBMS_OUTPUT.PUT_LINE('Monto total: $' || TO_CHAR(v_total, '999,999,999'));
    
EXCEPTION
    WHEN OTHERS THEN
        ROLLBACK;
        p_total_procesados := 0;
        p_monto_total := 0;
        RAISE_APPLICATION_ERROR(-20101, 'Error en procesamiento por periodo: ' || SQLERRM);
END sp_procesar_pedidos_periodo;
/

-- Procedimiento para actualización masiva de inventario (CON parámetros)
CREATE OR REPLACE PROCEDURE sp_actualizar_inventario_masivo (
    p_categoria IN NUMBER,
    p_porcentaje_ajuste IN NUMBER,
    p_tipo_ajuste IN VARCHAR2 DEFAULT 'PRECIO' -- 'PRECIO' o 'STOCK'
)
IS
    v_contador NUMBER := 0;
    v_productos_afectados NUMBER := 0;
    
    -- Cursor para productos de la categoría
    CURSOR cur_productos_categoria IS
        SELECT id_producto, nombre, precio, stock
        FROM producto
        WHERE id_categoria = p_categoria
        AND esta_activo = 'S';
        
BEGIN
    DBMS_OUTPUT.PUT_LINE('=== ACTUALIZACIÓN MASIVA DE INVENTARIO ===');
    DBMS_OUTPUT.PUT_LINE('Categoría: ' || p_categoria);
    DBMS_OUTPUT.PUT_LINE('Ajuste: ' || p_porcentaje_ajuste || '% en ' || p_tipo_ajuste);
    
    IF p_tipo_ajuste = 'PRECIO' THEN
        -- Actualización masiva de precios
        UPDATE producto 
        SET precio = precio * (1 + p_porcentaje_ajuste/100),
            fecha_actualizacion = SYSDATE
        WHERE id_categoria = p_categoria
        AND esta_activo = 'S';
        
        v_productos_afectados := SQL%ROWCOUNT;
        
    ELSIF p_tipo_ajuste = 'STOCK' THEN
        -- Actualización masiva de stock
        UPDATE producto 
        SET stock = GREATEST(0, stock + (stock * p_porcentaje_ajuste/100)),
            fecha_actualizacion = SYSDATE
        WHERE id_categoria = p_categoria
        AND esta_activo = 'S';
        
        v_productos_afectados := SQL%ROWCOUNT;
    END IF;
    
    COMMIT;
    
    DBMS_OUTPUT.PUT_LINE('Productos actualizados: ' || v_productos_afectados);
    DBMS_OUTPUT.PUT_LINE('=== FIN ACTUALIZACIÓN MASIVA ===');
    
EXCEPTION
    WHEN OTHERS THEN
        ROLLBACK;
        RAISE_APPLICATION_ERROR(-20102, 'Error en actualización masiva: ' || SQLERRM);
END sp_actualizar_inventario_masivo;
/

-- =============================================
-- 2. FUNCIONES CON Y SIN PARÁMETROS PARA PROCESAMIENTO MASIVO
-- =============================================

-- Función SIN parámetros - Retorna total de ventas del mes actual
CREATE OR REPLACE FUNCTION fn_ventas_mes_actual
RETURN NUMBER
IS
    v_total NUMBER := 0;
BEGIN
    SELECT NVL(SUM(p.total), 0)
    INTO v_total
    FROM pedido p
    WHERE EXTRACT(MONTH FROM p.fecha_pedido) = EXTRACT(MONTH FROM SYSDATE)
    AND EXTRACT(YEAR FROM p.fecha_pedido) = EXTRACT(YEAR FROM SYSDATE)
    AND p.estado_pedido_id_estado = 4; -- Entregados
    
    RETURN v_total;
EXCEPTION
    WHEN OTHERS THEN
        RETURN 0;
END fn_ventas_mes_actual;
/

-- Función CON parámetros - Calcula métricas avanzadas por periodo
CREATE OR REPLACE FUNCTION fn_metricas_ventas_periodo (
    p_fecha_inicio IN DATE,
    p_fecha_fin IN DATE,
    p_tipo_metrica IN VARCHAR2 DEFAULT 'TOTAL'
) RETURN NUMBER
IS
    v_resultado NUMBER := 0;
BEGIN
    CASE p_tipo_metrica
        WHEN 'TOTAL' THEN
            SELECT NVL(SUM(total), 0)
            INTO v_resultado
            FROM pedido
            WHERE fecha_pedido BETWEEN p_fecha_inicio AND p_fecha_fin
            AND estado_pedido_id_estado = 4;
            
        WHEN 'PROMEDIO' THEN
            SELECT NVL(AVG(total), 0)
            INTO v_resultado
            FROM pedido
            WHERE fecha_pedido BETWEEN p_fecha_inicio AND p_fecha_fin
            AND estado_pedido_id_estado = 4;
            
        WHEN 'CANTIDAD' THEN
            SELECT COUNT(*)
            INTO v_resultado
            FROM pedido
            WHERE fecha_pedido BETWEEN p_fecha_inicio AND p_fecha_fin
            AND estado_pedido_id_estado = 4;
            
        WHEN 'PRODUCTOS_VENDIDOS' THEN
            SELECT NVL(SUM(dp.cantidad), 0)
            INTO v_resultado
            FROM detalle_pedido dp
            JOIN pedido p ON dp.id_pedido = p.id_pedido
            WHERE p.fecha_pedido BETWEEN p_fecha_inicio AND p_fecha_fin
            AND p.estado_pedido_id_estado = 4;
            
        ELSE
            v_resultado := 0;
    END CASE;
    
    RETURN v_resultado;
    
EXCEPTION
    WHEN OTHERS THEN
        RETURN 0;
END fn_metricas_ventas_periodo;
/

-- Función para validar stock completo de un pedido (CON parámetro)
CREATE OR REPLACE FUNCTION fn_validar_stock_pedido_completo (
    p_id_pedido IN NUMBER
) RETURN NUMBER
IS
    v_productos_sin_stock NUMBER := 0;
BEGIN
    SELECT COUNT(*)
    INTO v_productos_sin_stock
    FROM detalle_pedido dp
    JOIN producto p ON dp.id_producto = p.id_producto
    WHERE dp.id_pedido = p_id_pedido
    AND (p.stock < dp.cantidad OR p.esta_activo = 'N');
    
    -- Retorna 1 si hay stock suficiente, 0 si no
    RETURN CASE WHEN v_productos_sin_stock = 0 THEN 1 ELSE 0 END;
    
EXCEPTION
    WHEN OTHERS THEN
        RETURN 0;
END fn_validar_stock_pedido_completo;
/

-- Función avanzada para análisis de categorías (CON múltiples parámetros)
CREATE OR REPLACE FUNCTION fn_analisis_categoria_avanzado (
    p_id_categoria IN NUMBER,
    p_meses_atras IN NUMBER DEFAULT 3,
    p_tipo_analisis IN VARCHAR2 DEFAULT 'VENTAS'
) RETURN NUMBER
IS
    v_resultado NUMBER := 0;
    v_fecha_limite DATE;
BEGIN
    v_fecha_limite := ADD_MONTHS(SYSDATE, -p_meses_atras);
    
    CASE p_tipo_analisis
        WHEN 'VENTAS' THEN
            -- Total de ventas en el periodo
            SELECT NVL(SUM(dp.cantidad * dp.precio_unitario), 0)
            INTO v_resultado
            FROM detalle_pedido dp
            JOIN producto pr ON dp.id_producto = pr.id_producto
            JOIN pedido p ON dp.id_pedido = p.id_pedido
            WHERE pr.id_categoria = p_id_categoria
            AND p.fecha_pedido >= v_fecha_limite
            AND p.estado_pedido_id_estado = 4;
            
        WHEN 'CANTIDAD' THEN
            -- Cantidad total vendida
            SELECT NVL(SUM(dp.cantidad), 0)
            INTO v_resultado
            FROM detalle_pedido dp
            JOIN producto pr ON dp.id_producto = pr.id_producto
            JOIN pedido p ON dp.id_pedido = p.id_pedido
            WHERE pr.id_categoria = p_id_categoria
            AND p.fecha_pedido >= v_fecha_limite
            AND p.estado_pedido_id_estado = 4;
            
        WHEN 'PRODUCTOS_ACTIVOS' THEN
            -- Número de productos activos en la categoría
            SELECT COUNT(*)
            INTO v_resultado
            FROM producto
            WHERE id_categoria = p_id_categoria
            AND esta_activo = 'S';
            
        WHEN 'STOCK_TOTAL' THEN
            -- Stock total disponible en la categoría
            SELECT NVL(SUM(stock), 0)
            INTO v_resultado
            FROM producto
            WHERE id_categoria = p_id_categoria
            AND esta_activo = 'S';
    END CASE;
    
    RETURN v_resultado;
    
EXCEPTION
    WHEN OTHERS THEN
        RETURN 0;
END fn_analisis_categoria_avanzado;
/

-- =============================================
-- 3. EJEMPLOS DE USO EN OTROS PROGRAMAS PL/SQL
-- =============================================

-- Ejemplo de uso de procedimientos y funciones en un programa PL/SQL complejo
CREATE OR REPLACE PROCEDURE sp_reporte_ejecutivo_mensual
IS
    v_ventas_mes NUMBER;
    v_pedidos_procesados NUMBER;
    v_monto_procesado NUMBER;
    v_fecha_inicio DATE := TRUNC(SYSDATE, 'MM');
    v_fecha_fin DATE := LAST_DAY(SYSDATE);
BEGIN
    DBMS_OUTPUT.PUT_LINE('======================================');
    DBMS_OUTPUT.PUT_LINE('    REPORTE EJECUTIVO MENSUAL');
    DBMS_OUTPUT.PUT_LINE('    ' || TO_CHAR(SYSDATE, 'MONTH YYYY'));
    DBMS_OUTPUT.PUT_LINE('======================================');
    
    -- Usar función SIN parámetros
    v_ventas_mes := fn_ventas_mes_actual();
    DBMS_OUTPUT.PUT_LINE('Ventas del mes actual: $' || TO_CHAR(v_ventas_mes, '999,999,999'));
    
    -- Usar función CON parámetros para diferentes métricas
    DBMS_OUTPUT.PUT_LINE('Promedio por pedido: $' || 
        TO_CHAR(fn_metricas_ventas_periodo(v_fecha_inicio, v_fecha_fin, 'PROMEDIO'), '999,999'));
    
    DBMS_OUTPUT.PUT_LINE('Total de pedidos: ' || 
        fn_metricas_ventas_periodo(v_fecha_inicio, v_fecha_fin, 'CANTIDAD'));
    
    DBMS_OUTPUT.PUT_LINE('Productos vendidos: ' || 
        fn_metricas_ventas_periodo(v_fecha_inicio, v_fecha_fin, 'PRODUCTOS_VENDIDOS'));
    
    -- Análisis por categorías (usando función con múltiples parámetros)
    DBMS_OUTPUT.PUT_LINE('--- ANÁLISIS POR CATEGORÍAS ---');
    FOR i IN 1..4 LOOP
        DBMS_OUTPUT.PUT_LINE('Categoría ' || i || ' - Ventas: $' || 
            TO_CHAR(fn_analisis_categoria_avanzado(i, 1, 'VENTAS'), '999,999,999'));
    END LOOP;
    
    -- Procesar pedidos pendientes usando procedimiento CON parámetros
    sp_procesar_pedidos_periodo(
        p_fecha_desde => v_fecha_inicio,
        p_fecha_hasta => v_fecha_fin,
        p_id_usuario => NULL,
        p_total_procesados => v_pedidos_procesados,
        p_monto_total => v_monto_procesado
    );
    
    DBMS_OUTPUT.PUT_LINE('--- PROCESAMIENTO REALIZADO ---');
    DBMS_OUTPUT.PUT_LINE('Pedidos procesados: ' || v_pedidos_procesados);
    DBMS_OUTPUT.PUT_LINE('Monto procesado: $' || TO_CHAR(v_monto_procesado, '999,999,999'));
    
    DBMS_OUTPUT.PUT_LINE('======================================');
    
END sp_reporte_ejecutivo_mensual;
/

-- =============================================
-- 4. EJEMPLOS DE USO EN SENTENCIAS SQL
-- =============================================

-- Script de demostración de uso en sentencias SQL
CREATE OR REPLACE PROCEDURE sp_demostrar_uso_sql
IS
BEGIN
    DBMS_OUTPUT.PUT_LINE('=== USO DE FUNCIONES EN SENTENCIAS SQL ===');
    
    -- Ejemplo 1: Función en SELECT
    FOR rec IN (
        SELECT 
            p.id_producto,
            p.nombre,
            p.stock,
            fn_analisis_categoria_avanzado(p.id_categoria, 3, 'VENTAS') as ventas_categoria,
            fn_analisis_categoria_avanzado(p.id_categoria, 3, 'STOCK_TOTAL') as stock_categoria
        FROM producto p
        WHERE p.esta_activo = 'S'
        AND fn_analisis_categoria_avanzado(p.id_categoria, 3, 'VENTAS') > 100000
        ORDER BY fn_analisis_categoria_avanzado(p.id_categoria, 3, 'VENTAS') DESC
    ) LOOP
        DBMS_OUTPUT.PUT_LINE('Producto: ' || rec.nombre || 
                           ' - Ventas categoría: $' || rec.ventas_categoria);
    END LOOP;
    
    -- Ejemplo 2: Función en WHERE con lógica compleja
    DBMS_OUTPUT.PUT_LINE('--- PRODUCTOS DE CATEGORÍAS TOP ---');
    FOR rec IN (
        SELECT DISTINCT c.nombre, c.id_categoria
        FROM categoria c
        WHERE fn_analisis_categoria_avanzado(c.id_categoria, 6, 'VENTAS') > 
              fn_ventas_mes_actual() * 0.1  -- Categorías que representan más del 10% de ventas mensuales
        ORDER BY fn_analisis_categoria_avanzado(c.id_categoria, 6, 'VENTAS') DESC
    ) LOOP
        DBMS_OUTPUT.PUT_LINE('Categoría TOP: ' || rec.nombre);
    END LOOP;
    
END sp_demostrar_uso_sql;
/

-- =============================================
-- 5. PROCEDIMIENTOS DE UTILIDAD
-- =============================================

-- Procedimiento helper para actualizar stock completo de un pedido
CREATE OR REPLACE PROCEDURE sp_actualizar_stock_venta_completa (
    p_id_pedido IN NUMBER
)
IS
BEGIN
    -- Actualizar stock de todos los productos del pedido
    UPDATE producto p
    SET stock = stock - (
        SELECT dp.cantidad 
        FROM detalle_pedido dp 
        WHERE dp.id_pedido = p_id_pedido 
        AND dp.id_producto = p.id_producto
    ),
    fecha_actualizacion = SYSDATE
    WHERE EXISTS (
        SELECT 1 FROM detalle_pedido dp 
        WHERE dp.id_pedido = p_id_pedido 
        AND dp.id_producto = p.id_producto
    );
    
    -- Actualizar estado del pedido
    UPDATE pedido 
    SET estado_pedido_id_estado = 2, -- En proceso
        fecha_actualizacion = SYSDATE
    WHERE id_pedido = p_id_pedido;
    
EXCEPTION
    WHEN OTHERS THEN
        RAISE_APPLICATION_ERROR(-20103, 'Error actualizando stock para pedido ' || p_id_pedido || ': ' || SQLERRM);
END sp_actualizar_stock_venta_completa;
/

COMMIT;

-- =============================================
-- FIN DEL ARCHIVO
-- =============================================