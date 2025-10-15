-- =============================================
-- PACKAGE ACTUALIZADO
-- =============================================
SET SERVEROUTPUT ON;
-- Package Specification
CREATE OR REPLACE PACKAGE pkg_huerto_hogar AS
    -- Funciones
    FUNCTION fn_calcular_descuento(p_total NUMBER, p_tipo_cliente VARCHAR2) RETURN NUMBER;
    FUNCTION fn_obtener_stock(p_id_producto VARCHAR2) RETURN NUMBER;
    FUNCTION fn_usuarios_por_region(p_id_region NUMBER) RETURN NUMBER;
    
    -- Procedimientos
    PROCEDURE sp_realizar_pedido(
        p_id_usuario NUMBER,
        p_productos SYS.ODCIVARCHAR2LIST,
        p_cantidades SYS.ODCINUMBERLIST
    );
    
    PROCEDURE sp_actualizar_estado_pedido(p_id_pedido NUMBER, p_estado VARCHAR2);
    PROCEDURE sp_generar_reporte_clientes_activos;
    
    -- Excepciones personalizadas
    e_stock_insuficiente EXCEPTION;
    e_usuario_invalido EXCEPTION;
    e_producto_inactivo EXCEPTION;
    
END pkg_huerto_hogar;
/

-- Package Body
CREATE OR REPLACE PACKAGE BODY pkg_huerto_hogar AS

    FUNCTION fn_calcular_descuento(p_total NUMBER, p_tipo_cliente VARCHAR2) RETURN NUMBER IS
        v_descuento NUMBER := 0;
    BEGIN
        CASE p_tipo_cliente
            WHEN 'FRECUENTE' THEN v_descuento := p_total * 0.10;
            WHEN 'VIP' THEN v_descuento := p_total * 0.15;
            WHEN 'NUEVO' THEN v_descuento := p_total * 0.05;
            ELSE v_descuento := 0;
        END CASE;
        
        RETURN v_descuento;
    END fn_calcular_descuento;

    FUNCTION fn_obtener_stock(p_id_producto VARCHAR2) RETURN NUMBER IS
        v_stock NUMBER;
    BEGIN
        SELECT stock INTO v_stock
        FROM producto
        WHERE id_producto = p_id_producto
        AND esta_activo = 'S';
        
        RETURN v_stock;
    EXCEPTION
        WHEN NO_DATA_FOUND THEN
            RETURN -1;
        WHEN OTHERS THEN
            RETURN -999;
    END fn_obtener_stock;

    FUNCTION fn_usuarios_por_region(p_id_region NUMBER) RETURN NUMBER IS
        v_total NUMBER;
    BEGIN
        SELECT COUNT(*)
        INTO v_total
        FROM usuario u
        JOIN comuna c ON u.id_comuna = c.id_comuna
        WHERE c.id_region = p_id_region;
        
        RETURN v_total;
    EXCEPTION
        WHEN OTHERS THEN
            RETURN 0;
    END fn_usuarios_por_region;

    PROCEDURE sp_realizar_pedido(
        p_id_usuario NUMBER,
        p_productos SYS.ODCIVARCHAR2LIST,
        p_cantidades SYS.ODCINUMBERLIST
    ) IS
        v_id_pedido NUMBER;
        v_total_pedido NUMBER := 0;
        v_usuario_count NUMBER;
        v_direccion_entrega usuario.direccion%TYPE;
    BEGIN
        -- Validar usuario
        SELECT COUNT(*), MAX(direccion) 
        INTO v_usuario_count, v_direccion_entrega
        FROM usuario 
        WHERE id_usuario = p_id_usuario
        AND id_tipo_usuario = 3; -- Solo clientes
        
        IF v_usuario_count = 0 THEN
            RAISE e_usuario_invalido;
        END IF;
        
        -- Crear pedido
        SELECT seq_pedido.NEXTVAL INTO v_id_pedido FROM DUAL;
        
        INSERT INTO pedido (id_pedido, fecha_pedido, total, 
                          direccion_entrega, id_usuario, estado_pedido_id_estado)
        VALUES (v_id_pedido, SYSDATE, 0, v_direccion_entrega, p_id_usuario, 1);
        
        -- Procesar productos
        FOR i IN 1..p_productos.COUNT LOOP
            DECLARE
                v_stock_actual NUMBER;
                v_precio producto.precio%TYPE;
                v_activo producto.esta_activo%TYPE;
            BEGIN
                -- Verificar producto
                SELECT stock, precio, esta_activo 
                INTO v_stock_actual, v_precio, v_activo
                FROM producto
                WHERE id_producto = p_productos(i);
                
                IF v_activo = 'N' THEN
                    DBMS_OUTPUT.PUT_LINE('Producto inactivo: ' || p_productos(i));
                    CONTINUE;
                END IF;
                
                IF p_cantidades(i) > v_stock_actual THEN
                    DBMS_OUTPUT.PUT_LINE('Stock insuficiente: ' || p_productos(i));
                    CONTINUE;
                END IF;
                
                -- Agregar detalle
                INSERT INTO detalle_pedido (id_pedido, id_producto, cantidad, precio_unitario, subtotal)
                VALUES (v_id_pedido, p_productos(i), p_cantidades(i), v_precio, p_cantidades(i) * v_precio);
                
                v_total_pedido := v_total_pedido + (p_cantidades(i) * v_precio);
                
                -- Actualizar stock
                UPDATE producto
                SET stock = stock - p_cantidades(i)
                WHERE id_producto = p_productos(i);
                
            EXCEPTION
                WHEN NO_DATA_FOUND THEN
                    DBMS_OUTPUT.PUT_LINE('Producto no encontrado: ' || p_productos(i));
                WHEN OTHERS THEN
                    DBMS_OUTPUT.PUT_LINE('Error procesando producto ' || p_productos(i) || ': ' || SQLERRM);
            END;
        END LOOP;
        
        -- Actualizar total del pedido
        UPDATE pedido
        SET total = v_total_pedido
        WHERE id_pedido = v_id_pedido;
        
        COMMIT;
        
        DBMS_OUTPUT.PUT_LINE('✅ Pedido ' || v_id_pedido || ' creado exitosamente');
        DBMS_OUTPUT.PUT_LINE('Total: $' || v_total_pedido);
        
    EXCEPTION
        WHEN e_usuario_invalido THEN
            RAISE_APPLICATION_ERROR(-20010, 'Usuario inválido: ' || p_id_usuario);
        WHEN OTHERS THEN
            ROLLBACK;
            RAISE;
    END sp_realizar_pedido;

    PROCEDURE sp_actualizar_estado_pedido(p_id_pedido NUMBER, p_estado VARCHAR2) IS
        v_pedido_count NUMBER;
        v_estado_id NUMBER;
    BEGIN
        -- Convertir descripción a ID
        CASE p_estado
            WHEN 'Pendiente' THEN v_estado_id := 1;
            WHEN 'Preparación' THEN v_estado_id := 2;
            WHEN 'Enviado' THEN v_estado_id := 3;
            WHEN 'Entregado' THEN v_estado_id := 4;
            WHEN 'Cancelado' THEN v_estado_id := 5;
            ELSE RAISE_APPLICATION_ERROR(-20011, 'Estado inválido: ' || p_estado);
        END CASE;
        
        -- Verificar pedido
        SELECT COUNT(*) INTO v_pedido_count FROM pedido WHERE id_pedido = p_id_pedido;
        IF v_pedido_count = 0 THEN
            RAISE_APPLICATION_ERROR(-20012, 'Pedido no encontrado: ' || p_id_pedido);
        END IF;
        
        UPDATE pedido
        SET estado_pedido_id_estado = v_estado_id,
            fecha_entrega = CASE WHEN v_estado_id = 4 THEN SYSDATE ELSE fecha_entrega END
        WHERE id_pedido = p_id_pedido;
        
        COMMIT;
        
        DBMS_OUTPUT.PUT_LINE('✅ Estado del pedido ' || p_id_pedido || ' actualizado a: ' || p_estado);
        
    EXCEPTION
        WHEN OTHERS THEN
            ROLLBACK;
            RAISE;
    END sp_actualizar_estado_pedido;

    PROCEDURE sp_generar_reporte_clientes_activos IS
        CURSOR c_clientes_activos IS
            SELECT u.id_usuario, u.nombre, u.email, c.nombre_comuna, r.nombre_region,
                   COUNT(p.id_pedido) as total_pedidos,
                   SUM(p.total) as total_gastado
            FROM usuario u
            JOIN comuna c ON u.id_comuna = c.id_comuna
            JOIN region r ON c.id_region = r.id_region
            LEFT JOIN pedido p ON u.id_usuario = p.id_usuario
            WHERE u.id_tipo_usuario = 3 -- Solo clientes
            AND p.estado_pedido_id_estado = 4 -- Solo entregados
            GROUP BY u.id_usuario, u.nombre, u.email, c.nombre_comuna, r.nombre_region
            HAVING COUNT(p.id_pedido) >= 1
            ORDER BY total_gastado DESC;
    BEGIN
        DBMS_OUTPUT.PUT_LINE('=== REPORTE DE CLIENTES ACTIVOS ===');
        DBMS_OUTPUT.PUT_LINE('=' || LPAD('=', 80, '='));
        
        FOR cliente IN c_clientes_activos LOOP
            DBMS_OUTPUT.PUT_LINE(
                RPAD(cliente.nombre, 20) || ' | ' ||
                RPAD(cliente.email, 25) || ' | ' ||
                RPAD(cliente.nombre_comuna, 15) || ' | ' ||
                RPAD(cliente.total_pedidos || ' pedidos', 12) || ' | ' ||
                '$' || LPAD(TO_CHAR(cliente.total_gastado, 'FM999,999'), 10)
            );
        END LOOP;
        
    EXCEPTION
        WHEN OTHERS THEN
            DBMS_OUTPUT.PUT_LINE('Error generando reporte: ' || SQLERRM);
    END sp_generar_reporte_clientes_activos;

END pkg_huerto_hogar;
/