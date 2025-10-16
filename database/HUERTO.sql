-- =============================================
-- ELIMINACIÓN DE TABLAS (si existen)
-- =============================================
BEGIN
    EXECUTE IMMEDIATE 'DROP TABLE blog CASCADE CONSTRAINTS';
EXCEPTION
    WHEN OTHERS THEN NULL;
END;
/

BEGIN
    EXECUTE IMMEDIATE 'DROP TABLE categoria CASCADE CONSTRAINTS';
EXCEPTION
    WHEN OTHERS THEN NULL;
END;
/

BEGIN
    EXECUTE IMMEDIATE 'DROP TABLE comuna CASCADE CONSTRAINTS';
EXCEPTION
    WHEN OTHERS THEN NULL;
END;
/

BEGIN
    EXECUTE IMMEDIATE 'DROP TABLE detalle_pedido CASCADE CONSTRAINTS';
EXCEPTION
    WHEN OTHERS THEN NULL;
END;
/

BEGIN
    EXECUTE IMMEDIATE 'DROP TABLE estado_pedido CASCADE CONSTRAINTS';
EXCEPTION
    WHEN OTHERS THEN NULL;
END;
/

BEGIN
    EXECUTE IMMEDIATE 'DROP TABLE pedido CASCADE CONSTRAINTS';
EXCEPTION
    WHEN OTHERS THEN NULL;
END;
/

BEGIN
    EXECUTE IMMEDIATE 'DROP TABLE producto CASCADE CONSTRAINTS';
EXCEPTION
    WHEN OTHERS THEN NULL;
END;
/

BEGIN
    EXECUTE IMMEDIATE 'DROP TABLE region CASCADE CONSTRAINTS';
EXCEPTION
    WHEN OTHERS THEN NULL;
END;
/

BEGIN
    EXECUTE IMMEDIATE 'DROP TABLE resena CASCADE CONSTRAINTS';
EXCEPTION
    WHEN OTHERS THEN NULL;
END;
/

BEGIN
    EXECUTE IMMEDIATE 'DROP TABLE tipo_usuario CASCADE CONSTRAINTS';
EXCEPTION
    WHEN OTHERS THEN NULL;
END;
/

BEGIN
    EXECUTE IMMEDIATE 'DROP TABLE usuario CASCADE CONSTRAINTS';
EXCEPTION
    WHEN OTHERS THEN NULL;
END;
/

BEGIN
    EXECUTE IMMEDIATE 'DROP SEQUENCE seq_usuario';
EXCEPTION
    WHEN OTHERS THEN NULL;
END;
/

BEGIN
    EXECUTE IMMEDIATE 'DROP SEQUENCE seq_blog';
EXCEPTION
    WHEN OTHERS THEN NULL;
END;
/

BEGIN
    EXECUTE IMMEDIATE 'DROP SEQUENCE seq_resena';
EXCEPTION
    WHEN OTHERS THEN NULL;
END;
/

BEGIN
    EXECUTE IMMEDIATE 'DROP SEQUENCE seq_pedido';
EXCEPTION
    WHEN OTHERS THEN NULL;
END;
/

BEGIN
    EXECUTE IMMEDIATE 'DROP SEQUENCE seq_categoria';
EXCEPTION
    WHEN OTHERS THEN NULL;
END;
/

-- =============================================
-- CREACIÓN DE TABLAS (Nueva estructura)
-- =============================================

CREATE TABLE blog (
    id_blog           NUMBER NOT NULL,
    titulo            VARCHAR2(150) NOT NULL,
    link_imagen       VARCHAR2(255),
    descripcion_corta VARCHAR2(300),
    descripcion_larga VARCHAR2(4000),
    fecha_publicacion DATE NOT NULL
);
ALTER TABLE blog ADD CONSTRAINT blog_pk PRIMARY KEY ( id_blog );

CREATE TABLE categoria (
    id_categoria NUMBER NOT NULL,
    nombre       VARCHAR2(100) NOT NULL,
    descripcion  VARCHAR2(500)
);
ALTER TABLE categoria ADD CONSTRAINT categoria_pk PRIMARY KEY ( id_categoria );

CREATE TABLE region (
    id_region     NUMBER(2) NOT NULL,
    nombre_region VARCHAR2(50) NOT NULL
);
ALTER TABLE region ADD CONSTRAINT region_pk PRIMARY KEY ( id_region );

CREATE TABLE comuna (
    id_comuna     NUMBER(3) NOT NULL,
    nombre_comuna VARCHAR2(50) NOT NULL,
    id_region     NUMBER(2) NOT NULL
);
ALTER TABLE comuna ADD CONSTRAINT comuna_pk PRIMARY KEY ( id_comuna );

CREATE TABLE tipo_usuario (
    id_tipo_usuario  NUMBER NOT NULL,
    descripcion_tipo VARCHAR2(20) NOT NULL
);
ALTER TABLE tipo_usuario ADD CONSTRAINT tipo_usuario_pk PRIMARY KEY ( id_tipo_usuario );

CREATE TABLE usuario (
    id_usuario      NUMBER NOT NULL,
    nombre          VARCHAR2(100) NOT NULL,
    email           VARCHAR2(100) NOT NULL,
    password        VARCHAR2(100) NOT NULL,
    fecha_registro  DATE NOT NULL,
    direccion       VARCHAR2(200),
    telefono        NUMBER(9),
    id_comuna       NUMBER(3) NOT NULL,
    id_tipo_usuario NUMBER NOT NULL
);
ALTER TABLE usuario ADD CONSTRAINT usuario_pk PRIMARY KEY ( id_usuario );

CREATE TABLE producto (
    id_producto            VARCHAR2(10) NOT NULL,
    nombre                 VARCHAR2(100) NOT NULL,
    link_imagen            VARCHAR2(255),
    descripcion            VARCHAR2(500),
    precio                 NUMBER NOT NULL,
    stock                  NUMBER NOT NULL,
    origen                 VARCHAR2(100),
    certificacion_organica CHAR(1) NOT NULL,
    esta_activo            CHAR(1) NOT NULL,
    fecha_ingreso          DATE NOT NULL,
    id_categoria           NUMBER NOT NULL
);
ALTER TABLE producto ADD CONSTRAINT producto_pk PRIMARY KEY ( id_producto );

CREATE TABLE estado_pedido (
    id_estado          NUMBER NOT NULL,
    descripcion_estado VARCHAR2(20) NOT NULL
);
ALTER TABLE estado_pedido ADD CONSTRAINT estado_pedido_pk PRIMARY KEY ( id_estado );

CREATE TABLE pedido (
    id_pedido               NUMBER NOT NULL,
    fecha_pedido            DATE NOT NULL,
    fecha_entrega           DATE,
    total                   NUMBER NOT NULL,
    direccion_entrega       VARCHAR2(200) NOT NULL,
    id_usuario              NUMBER NOT NULL,
    estado_pedido_id_estado NUMBER NOT NULL
);
ALTER TABLE pedido ADD CONSTRAINT pedido_pk PRIMARY KEY ( id_pedido );

CREATE TABLE detalle_pedido (
    id_pedido       NUMBER NOT NULL,
    id_producto     VARCHAR2(10) NOT NULL,
    cantidad        NUMBER NOT NULL,
    precio_unitario NUMBER NOT NULL,
    subtotal        NUMBER NOT NULL
);
ALTER TABLE detalle_pedido ADD CONSTRAINT detalle_pedido_pk PRIMARY KEY ( id_pedido, id_producto );

CREATE TABLE resena (
    id_resena    NUMBER NOT NULL,
    calificacion NUMBER(1) NOT NULL,
    comentario   VARCHAR2(500),
    fecha        DATE NOT NULL,
    aprobada     CHAR(1) NOT NULL,
    id_usuario   NUMBER NOT NULL,
    id_producto  VARCHAR2(10) NOT NULL
);
ALTER TABLE resena ADD CONSTRAINT resena_pk PRIMARY KEY ( id_resena );

-- =============================================
-- RELACIONES ENTRE TABLAS
-- =============================================

ALTER TABLE comuna
    ADD CONSTRAINT comuna_region_fk FOREIGN KEY ( id_region )
        REFERENCES region ( id_region );

ALTER TABLE usuario
    ADD CONSTRAINT usuario_comuna_fk FOREIGN KEY ( id_comuna )
        REFERENCES comuna ( id_comuna );

ALTER TABLE usuario
    ADD CONSTRAINT usuario_tipo_usuario_fk FOREIGN KEY ( id_tipo_usuario )
        REFERENCES tipo_usuario ( id_tipo_usuario );

ALTER TABLE producto
    ADD CONSTRAINT producto_categoria_fk FOREIGN KEY ( id_categoria )
        REFERENCES categoria ( id_categoria );

ALTER TABLE pedido
    ADD CONSTRAINT pedido_usuario_fk FOREIGN KEY ( id_usuario )
        REFERENCES usuario ( id_usuario );

ALTER TABLE pedido
    ADD CONSTRAINT pedido_estado_pedido_fk FOREIGN KEY ( estado_pedido_id_estado )
        REFERENCES estado_pedido ( id_estado );

ALTER TABLE detalle_pedido
    ADD CONSTRAINT detalle_pedido_pedido_fk FOREIGN KEY ( id_pedido )
        REFERENCES pedido ( id_pedido );

ALTER TABLE detalle_pedido
    ADD CONSTRAINT detalle_pedido_producto_fk FOREIGN KEY ( id_producto )
        REFERENCES producto ( id_producto );

ALTER TABLE resena
    ADD CONSTRAINT resena_usuario_fk FOREIGN KEY ( id_usuario )
        REFERENCES usuario ( id_usuario );

ALTER TABLE resena
    ADD CONSTRAINT resena_producto_fk FOREIGN KEY ( id_producto )
        REFERENCES producto ( id_producto );

-- =============================================
-- SECUENCIAS PARA IDs AUTOMÁTICOS
-- =============================================
CREATE SEQUENCE seq_usuario START WITH 1 INCREMENT BY 1;
CREATE SEQUENCE seq_blog START WITH 1 INCREMENT BY 1;
CREATE SEQUENCE seq_resena START WITH 1 INCREMENT BY 1;
CREATE SEQUENCE seq_pedido START WITH 1 INCREMENT BY 1;
CREATE SEQUENCE seq_categoria START WITH 1 INCREMENT BY 1;

-- =============================================
-- INSERCIÓN DE DATOS DE EJEMPLO
-- =============================================

-- 1) TIPOS DE USUARIO
INSERT INTO tipo_usuario (id_tipo_usuario, descripcion_tipo) VALUES (1, 'Administrador');
INSERT INTO tipo_usuario (id_tipo_usuario, descripcion_tipo) VALUES (2, 'Vendedor');
INSERT INTO tipo_usuario (id_tipo_usuario, descripcion_tipo) VALUES (3, 'Cliente');

-- 2) ESTADOS DE PEDIDO
INSERT INTO estado_pedido (id_estado, descripcion_estado) VALUES (1, 'Pendiente');
INSERT INTO estado_pedido (id_estado, descripcion_estado) VALUES (2, 'Preparación');
INSERT INTO estado_pedido (id_estado, descripcion_estado) VALUES (3, 'Enviado');
INSERT INTO estado_pedido (id_estado, descripcion_estado) VALUES (4, 'Entregado');
INSERT INTO estado_pedido (id_estado, descripcion_estado) VALUES (5, 'Cancelado');

-- 3) REGIONES
INSERT INTO region (id_region, nombre_region) VALUES ( 5, 'Valparaíso');
INSERT INTO region (id_region, nombre_region) VALUES ( 7, 'Maule');
INSERT INTO region (id_region, nombre_region) VALUES ( 8, 'Biobío');
INSERT INTO region (id_region, nombre_region) VALUES ( 9, 'La Araucanía');
INSERT INTO region (id_region, nombre_region) VALUES (10, 'Los Lagos');
INSERT INTO region (id_region, nombre_region) VALUES (13, 'Región Metropolitana de Santiago');

-- 4) COMUNAS
INSERT INTO comuna (id_comuna, nombre_comuna, id_region) VALUES (1,'Santiago',13);
INSERT INTO comuna (id_comuna, nombre_comuna, id_region) VALUES (2,'Valparaíso',5);
INSERT INTO comuna (id_comuna, nombre_comuna, id_region) VALUES (3,'Viña del Mar',5);
INSERT INTO comuna (id_comuna, nombre_comuna, id_region) VALUES (4,'Concepción',8);
INSERT INTO comuna (id_comuna, nombre_comuna, id_region) VALUES (5,'Nacimiento',8);
INSERT INTO comuna (id_comuna, nombre_comuna, id_region) VALUES (6,'Villarrica',9);
INSERT INTO comuna (id_comuna, nombre_comuna, id_region) VALUES (7,'Puerto Montt',10);

-- 5) CATEGORÍAS
INSERT INTO categoria (id_categoria, nombre, descripcion)
    VALUES (seq_categoria.NEXTVAL, 'Frutas Frescas', 'Frutas de temporada, frescas y sabrosas');
INSERT INTO categoria (id_categoria, nombre, descripcion)
    VALUES (seq_categoria.NEXTVAL, 'Verduras Orgánicas', 'Verduras cultivadas sin pesticidas');
INSERT INTO categoria (id_categoria, nombre, descripcion)
    VALUES (seq_categoria.NEXTVAL, 'Productos Orgánicos','Alimentos procesados de forma responsable');
INSERT INTO categoria (id_categoria, nombre, descripcion)
    VALUES (seq_categoria.NEXTVAL, 'Productos Lácteos',  'Lácteos de granjas locales');

-- 6) PRODUCTOS
INSERT INTO producto (id_producto, nombre, link_imagen, descripcion, precio, stock, origen,certificacion_organica, esta_activo, fecha_ingreso, id_categoria)
    VALUES('FR001', 'Manzanas Fuji', NULL,'Manzanas crujientes y dulces del Valle del Maule.',1200, 150, 'Valle del Maule','N', 'S', SYSDATE,1);

INSERT INTO producto (id_producto, nombre, link_imagen, descripcion, precio, stock, origen,certificacion_organica, esta_activo, fecha_ingreso, id_categoria)
    VALUES('FR002', 'Naranjas Valencia', NULL,'Jugosas y ricas en vitamina C, ideales para jugos frescos.',1000, 200, NULL,'N', 'S', SYSDATE,1);

INSERT INTO producto (id_producto, nombre, link_imagen, descripcion, precio, stock, origen,certificacion_organica, esta_activo, fecha_ingreso, id_categoria)
    VALUES('FR003', 'Plátanos Cavendish', NULL,'Maduros y dulces, ricos en potasio; perfectos para el desayuno.',800, 250, NULL,'N', 'S', SYSDATE,1);

INSERT INTO producto (id_producto, nombre, link_imagen, descripcion, precio, stock, origen,certificacion_organica, esta_activo, fecha_ingreso, id_categoria)
    VALUES('VR001', 'Zanahorias Orgánicas', NULL,'Cultivadas sin pesticidas, crujientes y ricas en vitamina A.',900, 100, 'Región de O''Higgins','S', 'S', SYSDATE,2);

INSERT INTO producto (id_producto, nombre, link_imagen, descripcion, precio, stock, origen,certificacion_organica, esta_activo, fecha_ingreso, id_categoria)
    VALUES('VR002', 'Espinacas Frescas', NULL,'Frescas y nutritivas, ideales para ensaladas y batidos.',700, 80, NULL,'S', 'S', SYSDATE,2);

INSERT INTO producto (id_producto, nombre, link_imagen, descripcion, precio, stock, origen,certificacion_organica, esta_activo, fecha_ingreso, id_categoria)
    VALUES('VR003', 'Pimientos Tricolores', NULL,'Rojos, amarillos y verdes; color y antioxidantes para tus platos.',1500, 120, NULL,'N', 'S', SYSDATE,2);

INSERT INTO producto (id_producto, nombre, link_imagen, descripcion, precio, stock, origen,certificacion_organica, esta_activo, fecha_ingreso, id_categoria)
    VALUES('PO001', 'Miel Orgánica', NULL,'Miel pura de apicultores locales, rica en antioxidantes.',5000, 50, NULL,'S', 'S', SYSDATE,3);

INSERT INTO producto (id_producto, nombre, link_imagen, descripcion, precio, stock, origen,certificacion_organica, esta_activo, fecha_ingreso, id_categoria)
    VALUES('PO003', 'Quinua Orgánica', NULL,'Grano andino rico en proteína; ideal para ensaladas y bowls.',3500, 60, NULL,'S', 'S', SYSDATE,3);

INSERT INTO producto (id_producto, nombre, link_imagen, descripcion, precio, stock, origen,certificacion_organica, esta_activo, fecha_ingreso, id_categoria)
VALUES('PL001', 'Leche Entera', NULL,'Lácteos de granjas locales, frescos y de calidad.',1200, 200, NULL,'N', 'S', SYSDATE,4);

-- 7) USUARIOS
INSERT INTO usuario (id_usuario, nombre, email, password, fecha_registro,direccion, telefono, id_comuna, id_tipo_usuario)
    VALUES (seq_usuario.NEXTVAL, 'Admin HuertoHogar', 'admin@profesor.duoc.cl', 'Admin*123',SYSDATE - 10, 'Av. Alameda 100, Santiago', 987654321, 1, 1);
INSERT INTO usuario (id_usuario, nombre, email, password, fecha_registro,direccion, telefono, id_comuna, id_tipo_usuario)
    VALUES (seq_usuario.NEXTVAL, 'Vendedor Valpo', 'vendedor@duoc.cl', 'Vend#2025',SYSDATE - 8, 'Calle Esmeralda 55, Valparaíso', 923456789, 2, 2);
INSERT INTO usuario (id_usuario, nombre, email, password, fecha_registro,direccion, telefono, id_comuna, id_tipo_usuario)
    VALUES (seq_usuario.NEXTVAL, 'Ana Gómez', 'ana.gomez@gmail.com', 'Ana$2025',SYSDATE - 6, '1 Norte 321, Viña del Mar', 934567891, 3, 3);
INSERT INTO usuario (id_usuario, nombre, email, password, fecha_registro,direccion, telefono, id_comuna, id_tipo_usuario)
    VALUES (seq_usuario.NEXTVAL, 'Luis Pérez', 'luis.perez@gmail.com', 'Luis_2025',SYSDATE - 5, 'Caupolicán 777, Concepción', 945678912, 4, 3);
INSERT INTO usuario (id_usuario, nombre, email, password, fecha_registro,direccion, telefono, id_comuna, id_tipo_usuario)
    VALUES (seq_usuario.NEXTVAL, 'María Torres', 'maria.torres@gmail.com', 'Maria!2025',SYSDATE - 3, 'Av. Los Notros 89, Puerto Montt', 956789123, 7, 3);

-- 8) BLOG
INSERT INTO blog (id_blog, titulo, link_imagen, descripcion_corta, descripcion_larga, fecha_publicacion) 
    VALUES (seq_blog.NEXTVAL,'Temporada de Manzanas en el Maule',NULL,
            'Consejos para aprovechar la temporada de manzanas Fuji del Valle del Maule.',
            'Las manzanas Fuji destacan por su equilibrio entre dulzor y acidez. En esta temporada, te sugerimos combinarlas en ensaladas frescas o tartas caseras. Además, apoyar a productores locales reduce la huella de carbono y fortalece la economía regional.',
            SYSDATE - 7);
INSERT INTO blog (id_blog, titulo, link_imagen, descripcion_corta, descripcion_larga, fecha_publicacion) 
    VALUES (seq_blog.NEXTVAL,'Cómo Armar un Carrito Saludable',NULL,
            'Ideas para elegir frutas, verduras y orgánicos que cubran tu semana.',
            'Planifica tu compra con base en recetas simples: espinacas para batidos, pimientos para salteados y miel orgánica para endulzar. Un carrito balanceado facilita mantener una dieta saludable y controlar el presupuesto.',
            SYSDATE - 4);
INSERT INTO blog (id_blog, titulo, link_imagen, descripcion_corta, descripcion_larga, fecha_publicacion) 
    VALUES (seq_blog.NEXTVAL,'Beneficios de Preferir Productos Locales',NULL,
            'Comprar local implica frescura, menos transporte y apoyo a la comunidad.',
            'Los productos locales suelen cosecharse en su punto óptimo y viajan menos, por lo que conservan mejor sabor y nutrientes. Además, al comprar local apoyas a agricultores y fomentas prácticas sostenibles.',
            SYSDATE - 2);

-- 9) PEDIDOS Y DETALLES (Necesitamos IDs de usuarios específicos)
DECLARE
    v_user_ana NUMBER;
    v_user_luis NUMBER;
BEGIN
    -- Obtener IDs de usuarios
    SELECT id_usuario INTO v_user_ana FROM usuario WHERE email = 'ana.gomez@gmail.com';
    SELECT id_usuario INTO v_user_luis FROM usuario WHERE email = 'luis.perez@gmail.com';
    
    -- Pedido 1 para Ana
    INSERT INTO pedido (id_pedido, fecha_pedido, fecha_entrega, total, direccion_entrega, id_usuario, estado_pedido_id_estado) 
        VALUES (seq_pedido.NEXTVAL, SYSDATE - 3, SYSDATE - 1, 4500, '1 Norte 321, Viña del Mar', v_user_ana, 4);
    
    INSERT INTO detalle_pedido (id_pedido, id_producto, cantidad, precio_unitario, subtotal)
        VALUES (seq_pedido.CURRVAL, 'FR001', 2, 1200, 2400);
    INSERT INTO detalle_pedido (id_pedido, id_producto, cantidad, precio_unitario, subtotal)
        VALUES (seq_pedido.CURRVAL, 'VR002', 3, 700, 2100);
    
    -- Pedido 2 para Luis
    INSERT INTO pedido (id_pedido, fecha_pedido, fecha_entrega, total, direccion_entrega, id_usuario, estado_pedido_id_estado) 
        VALUES (seq_pedido.NEXTVAL, SYSDATE - 1, NULL, 7400, 'Caupolicán 777, Concepción', v_user_luis, 3);
    
    INSERT INTO detalle_pedido (id_pedido, id_producto, cantidad, precio_unitario, subtotal)
        VALUES (seq_pedido.CURRVAL, 'PO001', 1, 5000, 5000);
    INSERT INTO detalle_pedido (id_pedido, id_producto, cantidad, precio_unitario, subtotal)
        VALUES (seq_pedido.CURRVAL, 'PL001', 2, 1200, 2400);
END;
/

-- 10) RESEÑAS
DECLARE
    v_user_ana NUMBER;
    v_user_luis NUMBER;
BEGIN
    -- Obtener IDs de usuarios
    SELECT id_usuario INTO v_user_ana FROM usuario WHERE email = 'ana.gomez@gmail.com';
    SELECT id_usuario INTO v_user_luis FROM usuario WHERE email = 'luis.perez@gmail.com';
    
    INSERT INTO resena (id_resena, calificacion, comentario, fecha, aprobada, id_usuario, id_producto) 
        VALUES (seq_resena.NEXTVAL, 5, 'Excelente calidad y sabor.', SYSDATE - 1, 'S', v_user_ana, 'FR001');
    
    INSERT INTO resena (id_resena, calificacion, comentario, fecha, aprobada, id_usuario, id_producto) 
        VALUES (seq_resena.NEXTVAL, 4, 'Muy buena miel, volvería a comprar.', SYSDATE, 'S', v_user_luis, 'PO001');
END;
/

COMMIT;

-- =============================================
-- COMMIT Y MENSAJE DE CONFIRMACIÓN
-- =============================================
COMMIT;

SET SERVEROUTPUT ON;
DECLARE
    v_usuarios NUMBER;
    v_categorias NUMBER;
    v_productos NUMBER;
    v_pedidos NUMBER;
    v_detalles NUMBER;
    v_resenas NUMBER;
    v_regiones NUMBER;
    v_comunas NUMBER;
    v_blog NUMBER;
BEGIN
    SELECT COUNT(*) INTO v_usuarios FROM usuario;
    SELECT COUNT(*) INTO v_categorias FROM categoria;
    SELECT COUNT(*) INTO v_productos FROM producto;
    SELECT COUNT(*) INTO v_pedidos FROM pedido;
    SELECT COUNT(*) INTO v_detalles FROM detalle_pedido;
    SELECT COUNT(*) INTO v_resenas FROM resena;
    SELECT COUNT(*) INTO v_regiones FROM region;
    SELECT COUNT(*) INTO v_comunas FROM comuna;
    SELECT COUNT(*) INTO v_blog FROM blog;

    DBMS_OUTPUT.PUT_LINE('✅ Base de datos HuertoHogar creada exitosamente');
    DBMS_OUTPUT.PUT_LINE('📊 Resumen de datos insertados:');
    DBMS_OUTPUT.PUT_LINE('   - ' || v_usuarios || ' usuarios');
    DBMS_OUTPUT.PUT_LINE('   - ' || v_categorias || ' categorías');
    DBMS_OUTPUT.PUT_LINE('   - ' || v_productos || ' productos');
    DBMS_OUTPUT.PUT_LINE('   - ' || v_pedidos || ' pedidos');
    DBMS_OUTPUT.PUT_LINE('   - ' || v_detalles || ' detalles de pedido');
    DBMS_OUTPUT.PUT_LINE('   - ' || v_resenas || ' reseñas');
    DBMS_OUTPUT.PUT_LINE('   - ' || v_regiones || ' regiones');
    DBMS_OUTPUT.PUT_LINE('   - ' || v_comunas || ' comunas');
    DBMS_OUTPUT.PUT_LINE('   - ' || v_blog || ' entradas de blog');
END;
/