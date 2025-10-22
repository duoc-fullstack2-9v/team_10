-- =============================================
-- PRUEBAS Y EJEMPLOS
-- =============================================

-- Probar función de ventas por categoría
BEGIN
    DBMS_OUTPUT.PUT_LINE('Ventas Frutas Frescas: $' || fn_total_ventas_categoria(1));
    DBMS_OUTPUT.PUT_LINE('Ventas Verduras Orgánicas: $' || fn_total_ventas_categoria(2));
END;
/

-- Probar procedimiento de actualización de stock
BEGIN
    sp_actualizar_stock_venta('FR001', 5);
    DBMS_OUTPUT.PUT_LINE('Nuevo stock FR001: ' || pkg_huerto_hogar.fn_obtener_stock('FR001'));
END;
/

-- Probar función de usuarios por región
BEGIN
    DBMS_OUTPUT.PUT_LINE('Usuarios Región Metropolitana: ' || pkg_huerto_hogar.fn_usuarios_por_region(13));
END;
/

-- Probar package con pedido
DECLARE
    v_productos SYS.ODCIVARCHAR2LIST := SYS.ODCIVARCHAR2LIST('FR001', 'VR001');
    v_cantidades SYS.ODCINUMBERLIST := SYS.ODCINUMBERLIST(2, 1);
BEGIN
    pkg_huerto_hogar.sp_realizar_pedido(3, v_productos, v_cantidades);
END;
/

-- Probar reporte de ventas
BEGIN
    sp_generar_reporte_ventas(SYSDATE - 7, SYSDATE);
END;
/

-- Probar reporte de clientes activos
BEGIN
    pkg_huerto_hogar.sp_generar_reporte_clientes_activos;
END;
/