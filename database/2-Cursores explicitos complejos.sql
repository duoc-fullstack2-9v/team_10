-- =============================================
-- CURSORES EXPLÍCITOS COMPLEJOS
-- =============================================
SET SERVEROUTPUT ON;
DECLARE
    -- Cursor con parámetro para pedidos por usuario
    CURSOR c_pedidos_usuario (p_id_usuario NUMBER) IS
        SELECT p.id_pedido, p.fecha_pedido, p.total,
               ep.descripcion_estado as estado
        FROM pedido p
        JOIN estado_pedido ep ON p.estado_pedido_id_estado = ep.id_estado
        WHERE p.id_usuario = p_id_usuario
        ORDER BY p.fecha_pedido DESC;
    
    -- Cursor con parámetro para detalles de pedido
    CURSOR c_detalles_pedido (p_id_pedido NUMBER) IS
        SELECT p.nombre, dp.cantidad, dp.precio_unitario, dp.subtotal,
               c.nombre as categoria
        FROM detalle_pedido dp
        JOIN producto p ON dp.id_producto = p.id_producto
        JOIN categoria c ON p.id_categoria = c.id_categoria
        WHERE dp.id_pedido = p_id_pedido;
    
    -- Variables
    v_total_usuario NUMBER := 0;
    v_contador_pedidos NUMBER := 0;
    
BEGIN
    DBMS_OUTPUT.PUT_LINE('=== REPORTE DE PEDIDOS POR USUARIO ===');
    
    -- Loop principal: pedidos del usuario
    FOR ped IN c_pedidos_usuario(3) LOOP
        v_contador_pedidos := v_contador_pedidos + 1;
        v_total_usuario := v_total_usuario + NVL(ped.total, 0);
        
        DBMS_OUTPUT.PUT_LINE('📦 Pedido #' || ped.id_pedido);
        DBMS_OUTPUT.PUT_LINE('   Fecha: ' || TO_CHAR(ped.fecha_pedido, 'DD/MM/YYYY'));
        DBMS_OUTPUT.PUT_LINE('   Estado: ' || ped.estado);
        DBMS_OUTPUT.PUT_LINE('   Total: $' || ped.total);
        DBMS_OUTPUT.PUT_LINE('   Productos:');
        
        -- Loop anidado: detalles del pedido
        FOR det IN c_detalles_pedido(ped.id_pedido) LOOP
            DBMS_OUTPUT.PUT_LINE('     - ' || det.nombre || ' (' || det.categoria || ') | ' || 
                                det.cantidad || ' unidades | ' ||
                                '$' || det.precio_unitario || ' c/u | ' ||
                                'Subtotal: $' || det.subtotal);
        END LOOP;
        
        DBMS_OUTPUT.PUT_LINE('');
    END LOOP;
    
    -- Resumen final
    DBMS_OUTPUT.PUT_LINE('=== RESUMEN ===');
    DBMS_OUTPUT.PUT_LINE('Total de pedidos: ' || v_contador_pedidos);
    DBMS_OUTPUT.PUT_LINE('Gasto total del usuario: $' || v_total_usuario);
    
EXCEPTION
    WHEN NO_DATA_FOUND THEN
        DBMS_OUTPUT.PUT_LINE('El usuario no tiene pedidos registrados');
    WHEN OTHERS THEN
        DBMS_OUTPUT.PUT_LINE('Error al generar reporte: ' || SQLERRM);
END;
/