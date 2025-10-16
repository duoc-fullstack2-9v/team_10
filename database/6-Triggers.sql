-- =============================================
-- TRIGGERS ACTUALIZADOS
-- =============================================
DROP TABLE auditoria_productos CASCADE CONSTRAINTS;
DROP TRIGGER tr_auditoria_productos;
DROP TRIGGER tr_validar_stock_pedido;
DROP SEQUENCE seq_auditoria;


-- Tabla de auditoría para productos
CREATE TABLE auditoria_productos (
    id_auditoria NUMBER PRIMARY KEY,
    id_producto VARCHAR2(10),
    accion VARCHAR2(10),
    precio_anterior NUMBER,
    precio_nuevo NUMBER,
    stock_anterior NUMBER,
    stock_nuevo NUMBER,
    fecha DATE DEFAULT SYSDATE,
    usuario VARCHAR2(100)
);

CREATE SEQUENCE seq_auditoria START WITH 1 INCREMENT BY 1;

-- Trigger para auditoría de cambios en productos
CREATE OR REPLACE TRIGGER tr_auditoria_productos
AFTER UPDATE OR DELETE ON producto
FOR EACH ROW
DECLARE
    v_accion VARCHAR2(10);
BEGIN
    IF UPDATING THEN
        v_accion := 'UPDATE';
        
        INSERT INTO auditoria_productos (id_auditoria, id_producto, accion, 
                                       precio_anterior, precio_nuevo,
                                       stock_anterior, stock_nuevo, fecha, usuario)
        VALUES (seq_auditoria.NEXTVAL, :OLD.id_producto, v_accion,
               :OLD.precio, :NEW.precio,
               :OLD.stock, :NEW.stock, SYSDATE, USER);
               
    ELSIF DELETING THEN
        v_accion := 'DELETE';
        
        INSERT INTO auditoria_productos (id_auditoria, id_producto, accion,
                                       precio_anterior, stock_anterior, fecha, usuario)
        VALUES (seq_auditoria.NEXTVAL, :OLD.id_producto, v_accion,
               :OLD.precio, :OLD.stock, SYSDATE, USER);
    END IF;
END;
/

-- Trigger para validar stock antes de insertar detalle de pedido
CREATE OR REPLACE TRIGGER tr_validar_stock_pedido
BEFORE INSERT ON detalle_pedido
FOR EACH ROW
DECLARE
    v_stock_actual producto.stock%TYPE;
    v_esta_activo producto.esta_activo%TYPE;
BEGIN
    SELECT stock, esta_activo INTO v_stock_actual, v_esta_activo
    FROM producto
    WHERE id_producto = :NEW.id_producto;
    
    IF v_esta_activo = 'N' THEN
        RAISE_APPLICATION_ERROR(-20001, 'Producto inactivo: ' || :NEW.id_producto);
    END IF;
    
    IF :NEW.cantidad > v_stock_actual THEN
        RAISE_APPLICATION_ERROR(-20002,
            'Stock insuficiente para ' || :NEW.id_producto ||
            '. Disponible: ' || v_stock_actual || ', Solicitado: ' || :NEW.cantidad);
    END IF;
EXCEPTION
    WHEN NO_DATA_FOUND THEN
        RAISE_APPLICATION_ERROR(-20003, 'Producto no encontrado: ' || :NEW.id_producto);
END;
/