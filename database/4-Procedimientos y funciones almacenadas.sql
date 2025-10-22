-- =============================================
-- PROCEDIMIENTOS ALMACENADOS
-- =============================================
SET SERVEROUTPUT ON;
-- Función para calcular ventas por categoría
CREATE OR REPLACE FUNCTION fn_total_ventas_categoria (
    p_id_categoria categoria.id_categoria%TYPE
) RETURN NUMBER
IS
    v_total NUMBER := 0;
BEGIN
    SELECT SUM(dp.cantidad * dp.precio_unitario)
    INTO v_total
    FROM detalle_pedido dp
    JOIN producto p ON dp.id_producto = p.id_producto
    JOIN pedido ped ON dp.id_pedido = ped.id_pedido
    WHERE p.id_categoria = p_id_categoria
    AND ped.estado_pedido_id_estado = 4; -- Solo pedidos entregados
    
    RETURN NVL(v_total, 0);
EXCEPTION
    WHEN OTHERS THEN
        RETURN 0;
END fn_total_ventas_categoria;
/

-- Procedimiento para actualizar stock después de venta
CREATE OR REPLACE PROCEDURE sp_actualizar_stock_venta (
    p_id_producto IN producto.id_producto%TYPE,
    p_cantidad IN NUMBER
)
IS
    v_stock_actual producto.stock%TYPE;
    v_esta_activo producto.esta_activo%TYPE;
BEGIN
    -- Verificar que producto existe y está activo
    SELECT stock, esta_activo INTO v_stock_actual, v_esta_activo
    FROM producto
    WHERE id_producto = p_id_producto;
    
    IF v_esta_activo = 'N' THEN
        RAISE_APPLICATION_ERROR(-20002, 'Producto inactivo: ' || p_id_producto);
    END IF;
    
    -- Validar stock suficiente
    IF p_cantidad > v_stock_actual THEN
        RAISE_APPLICATION_ERROR(-20001, 
            'Stock insuficiente para ' || p_id_producto || 
            '. Disponible: ' || v_stock_actual || ', Solicitado: ' || p_cantidad);
    END IF;
    
    -- Actualizar stock
    UPDATE producto
    SET stock = stock - p_cantidad
    WHERE id_producto = p_id_producto;
    
    COMMIT;
    
    DBMS_OUTPUT.PUT_LINE('✅ Stock actualizado exitosamente para ' || p_id_producto);
    
EXCEPTION
    WHEN NO_DATA_FOUND THEN
        RAISE_APPLICATION_ERROR(-20003, 'Producto no encontrado: ' || p_id_producto);
    WHEN OTHERS THEN
        ROLLBACK;
        RAISE;
END sp_actualizar_stock_venta;
/

-- Procedimiento para generar reporte de ventas
CREATE OR REPLACE PROCEDURE sp_generar_reporte_ventas (
    p_fecha_inicio IN DATE DEFAULT TRUNC(SYSDATE) - 30,
    p_fecha_fin IN DATE DEFAULT SYSDATE
)
IS
    CURSOR c_ventas IS
        SELECT p.id_producto, p.nombre, c.nombre as categoria,
               SUM(dp.cantidad) as total_vendido,
               SUM(dp.cantidad * dp.precio_unitario) as total_ingresos
        FROM detalle_pedido dp
        JOIN producto p ON dp.id_producto = p.id_producto
        JOIN categoria c ON p.id_categoria = c.id_categoria
        JOIN pedido ped ON dp.id_pedido = ped.id_pedido
        WHERE ped.fecha_pedido BETWEEN p_fecha_inicio AND p_fecha_fin
        AND ped.estado_pedido_id_estado = 4 -- Solo entregados
        GROUP BY p.id_producto, p.nombre, c.nombre
        ORDER BY total_ingresos DESC;
    
    v_total_general NUMBER := 0;
BEGIN
    DBMS_OUTPUT.PUT_LINE('=== REPORTE DE VENTAS ===');
    DBMS_OUTPUT.PUT_LINE('Período: ' || TO_CHAR(p_fecha_inicio, 'DD/MM/YYYY') || 
                       ' - ' || TO_CHAR(p_fecha_fin, 'DD/MM/YYYY'));
    DBMS_OUTPUT.PUT_LINE('=' || LPAD('=', 60, '='));
    
    FOR venta IN c_ventas LOOP
        DBMS_OUTPUT.PUT_LINE(
            RPAD(venta.nombre, 25) || ' | ' ||
            RPAD(venta.categoria, 20) || ' | ' ||
            RPAD(venta.total_vendido || ' unidades', 15) || ' | ' ||
            '$' || LPAD(TO_CHAR(venta.total_ingresos, 'FM999,999'), 12)
        );
        v_total_general := v_total_general + venta.total_ingresos;
    END LOOP;
    
    DBMS_OUTPUT.PUT_LINE('=' || LPAD('=', 60, '='));
    DBMS_OUTPUT.PUT_LINE('TOTAL GENERAL: $' || TO_CHAR(v_total_general, 'FM999,999'));
    
EXCEPTION
    WHEN OTHERS THEN
        DBMS_OUTPUT.PUT_LINE('Error al generar reporte: ' || SQLERRM);
END sp_generar_reporte_ventas;
/