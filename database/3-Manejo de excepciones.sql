-- =============================================
-- MANEJO DE EXCEPCIONES
-- =============================================
SET SERVEROUTPUT ON;
DECLARE
    -- Excepciones personalizadas
    e_stock_insuficiente EXCEPTION;
    PRAGMA EXCEPTION_INIT(e_stock_insuficiente, -20001);
    
    e_producto_inactivo EXCEPTION;
    PRAGMA EXCEPTION_INIT(e_producto_inactivo, -20002);
    
    e_precio_invalido EXCEPTION;
    PRAGMA EXCEPTION_INIT(e_precio_invalido, -20003);
    
    -- Variables
    v_producto_id producto.id_producto%TYPE := 'FR001';
    v_cantidad NUMBER := 200;
    v_stock_actual producto.stock%TYPE;
    v_precio_producto producto.precio%TYPE;
    v_esta_activo producto.esta_activo%TYPE;
    
BEGIN
    DBMS_OUTPUT.PUT_LINE('=== VALIDACIÓN DE STOCK Y PRECIO ===');
    
    -- Obtener información del producto
    BEGIN
        SELECT stock, precio, esta_activo 
        INTO v_stock_actual, v_precio_producto, v_esta_activo
        FROM producto 
        WHERE id_producto = v_producto_id;
        
        DBMS_OUTPUT.PUT_LINE('Producto: ' || v_producto_id);
        DBMS_OUTPUT.PUT_LINE('Stock actual: ' || v_stock_actual);
        DBMS_OUTPUT.PUT_LINE('Precio: $' || v_precio_producto);
        DBMS_OUTPUT.PUT_LINE('Activo: ' || v_esta_activo);
        
    EXCEPTION
        WHEN NO_DATA_FOUND THEN
            RAISE_APPLICATION_ERROR(-20004, 'Producto no encontrado: ' || v_producto_id);
    END;
    
    -- Validar que el producto esté activo
    IF v_esta_activo = 'N' THEN
        RAISE e_producto_inactivo;
    END IF;
    
    -- Validar stock (excepción personalizada)
    IF v_cantidad > v_stock_actual THEN
        RAISE e_stock_insuficiente;
    END IF;
    
    -- Validar precio (excepción personalizada)
    IF v_precio_producto <= 0 THEN
        RAISE e_precio_invalido;
    END IF;
    
    DBMS_OUTPUT.PUT_LINE('✅ Validaciones exitosas - Stock suficiente');
    
EXCEPTION
    WHEN e_stock_insuficiente THEN
        DBMS_OUTPUT.PUT_LINE('❌ Error: Stock insuficiente. Disponible: ' || 
                           v_stock_actual || ', Solicitado: ' || v_cantidad);
        
    WHEN e_producto_inactivo THEN
        DBMS_OUTPUT.PUT_LINE('❌ Error: Producto inactivo: ' || v_producto_id);
        
    WHEN e_precio_invalido THEN
        DBMS_OUTPUT.PUT_LINE('❌ Error: Precio inválido para el producto');
        
    WHEN DUP_VAL_ON_INDEX THEN
        DBMS_OUTPUT.PUT_LINE('❌ Error: Intento de duplicar un registro único');
        
    WHEN TOO_MANY_ROWS THEN
        DBMS_OUTPUT.PUT_LINE('❌ Error: La consulta retornó múltiples filas');
        
    WHEN VALUE_ERROR THEN
        DBMS_OUTPUT.PUT_LINE('❌ Error: Problema de conversión de datos');
        
    WHEN OTHERS THEN
        DBMS_OUTPUT.PUT_LINE('❌ Error inesperado: ' || SQLCODE || ' - ' || SQLERRM);
END;
/