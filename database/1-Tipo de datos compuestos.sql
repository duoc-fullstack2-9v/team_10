-- =============================================
-- TIPOS DE DATOS COMPUESTOS (RECORD Y VARRAY)
-- =============================================
SET SERVEROUTPUT ON;
DECLARE
    -- Variable para almacenar cada campo individualmente
    v_id_usuario usuario.id_usuario%TYPE;
    v_nombre usuario.nombre%TYPE;
    v_email usuario.email%TYPE;
    v_direccion usuario.direccion%TYPE;
    v_comuna comuna.nombre_comuna%TYPE;
    v_region region.nombre_region%TYPE;
    v_tipo_usuario tipo_usuario.descripcion_tipo%TYPE;
    v_total_compras NUMBER;
    
    -- VARRAY para productos
    TYPE t_nombres_productos IS VARRAY(100) OF VARCHAR2(100);
    v_productos_populares t_nombres_productos := t_nombres_productos();
    v_contador NUMBER := 0;

BEGIN
    -- Obtener información de usuario
    SELECT u.id_usuario, u.nombre, u.email, u.direccion,
           c.nombre_comuna, r.nombre_region, tu.descripcion_tipo,
           NVL((SELECT SUM(total) FROM pedido WHERE id_usuario = u.id_usuario), 0)
    INTO v_id_usuario, v_nombre, v_email, v_direccion,
         v_comuna, v_region, v_tipo_usuario, v_total_compras
    FROM usuario u
    JOIN comuna c ON u.id_comuna = c.id_comuna
    JOIN region r ON c.id_region = r.id_region
    JOIN tipo_usuario tu ON u.id_tipo_usuario = tu.id_tipo_usuario
    WHERE u.id_usuario = &ID_USUARIO;

    DBMS_OUTPUT.PUT_LINE('=== INFORMACIÓN DE USUARIO ===');
    DBMS_OUTPUT.PUT_LINE('ID: ' || v_id_usuario);
    DBMS_OUTPUT.PUT_LINE('Nombre: ' || v_nombre);
    DBMS_OUTPUT.PUT_LINE('Email: ' || v_email);
    DBMS_OUTPUT.PUT_LINE('Dirección: ' || v_direccion);
    DBMS_OUTPUT.PUT_LINE('Comuna: ' || v_comuna);
    DBMS_OUTPUT.PUT_LINE('Región: ' || v_region);
    DBMS_OUTPUT.PUT_LINE('Tipo Usuario: ' || v_tipo_usuario);
    DBMS_OUTPUT.PUT_LINE('Total compras: $' || v_total_compras);
    DBMS_OUTPUT.PUT_LINE('');

    -- Ejemplo con VARRAY: Productos más vendidos
    FOR prod IN (
        SELECT p.nombre
        FROM producto p
        JOIN detalle_pedido dp ON p.id_producto = dp.id_producto
        JOIN pedido ped ON dp.id_pedido = ped.id_pedido
        WHERE ped.estado_pedido_id_estado = 4 -- Entregados
        GROUP BY p.nombre
        ORDER BY SUM(dp.cantidad) DESC
        FETCH FIRST 5 ROWS ONLY
    ) LOOP
        v_contador := v_contador + 1;
        v_productos_populares.EXTEND;
        v_productos_populares(v_contador) := prod.nombre;
    END LOOP;

    DBMS_OUTPUT.PUT_LINE('=== PRODUCTOS MÁS VENDIDOS ===');
    IF v_productos_populares.COUNT > 0 THEN
        FOR i IN 1..v_productos_populares.COUNT LOOP
            DBMS_OUTPUT.PUT_LINE(i || '. ' || v_productos_populares(i));
        END LOOP;
    ELSE
        DBMS_OUTPUT.PUT_LINE('No hay productos vendidos aún');
    END IF;

EXCEPTION
    WHEN NO_DATA_FOUND THEN
        DBMS_OUTPUT.PUT_LINE('Error: No se encontraron usuarios');
    WHEN OTHERS THEN
        DBMS_OUTPUT.PUT_LINE('Error: ' || SQLERRM);
END;
/