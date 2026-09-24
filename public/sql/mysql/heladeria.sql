-- =====================================================================
-- Heladería: esquema reducido y datos de ejemplo (MySQL 8.0.16 o superior, MariaDB 10.4 o superior)
-- Guía «Agentes de IA y bases de datos», Laboratorio de Bases de Datos
--
-- Uso:
--   mysql -u root -p -e "CREATE DATABASE heladeria CHARACTER SET utf8mb4"
--   mysql -u root -p heladeria < heladeria.sql
--
-- Versión reducida del caso «Bariloche Ya», centrada en la columna
-- calculada pedidos.total. Se utiliza en el capítulo 6.
-- =====================================================================

SET NAMES utf8mb4;

DROP TABLE IF EXISTS contiene, pedidos, helados, clientes;

CREATE TABLE clientes (
    idcliente INTEGER NOT NULL AUTO_INCREMENT PRIMARY KEY,
    nombre    VARCHAR(100) NOT NULL,
    email     VARCHAR(255) NOT NULL UNIQUE
);

CREATE TABLE helados (
    idhelado INTEGER NOT NULL AUTO_INCREMENT PRIMARY KEY,
    nombre   VARCHAR(100)  NOT NULL UNIQUE,
    precio   NUMERIC(10,2) NOT NULL CHECK (precio > 0)
);

CREATE TABLE pedidos (
    idpedido INTEGER NOT NULL AUTO_INCREMENT PRIMARY KEY,
    fecha    DATE          NOT NULL,
    cliente  INTEGER       NOT NULL,
    total    NUMERIC(10,2) NOT NULL DEFAULT 0 CHECK (total >= 0), -- columna calculada
    CONSTRAINT fk_pedidos_clientes FOREIGN KEY (cliente) REFERENCES clientes (idcliente)
);

CREATE TABLE contiene (
    pedido          INTEGER       NOT NULL,
    helado          INTEGER       NOT NULL,
    cantidad        INTEGER       NOT NULL CHECK (cantidad > 0),
    precio_unitario NUMERIC(10,2) NOT NULL,
    CONSTRAINT pk_contiene PRIMARY KEY (pedido, helado),
    CONSTRAINT fk_contiene_pedidos FOREIGN KEY (pedido) REFERENCES pedidos (idpedido),
    CONSTRAINT fk_contiene_helados FOREIGN KEY (helado) REFERENCES helados (idhelado)
);

-- Mantenimiento de la columna calculada pedidos.total
CREATE TRIGGER tg_contiene_total
AFTER INSERT ON contiene
FOR EACH ROW
    UPDATE pedidos
    SET total = total + NEW.cantidad * NEW.precio_unitario
    WHERE idpedido = NEW.pedido;

-- ---------------------------------------------------------------------
-- Datos (ficticios)
-- ---------------------------------------------------------------------

INSERT INTO clientes (nombre, email) VALUES
    ('Kiosco El Faro',        'elfaro@correo.test'),
    ('Restaurante La Posta',  'laposta@correo.test'),
    ('Almacén Don Pedro',     'donpedro@correo.test'),
    ('Club Atlético Unión',   'union@correo.test'),
    ('Confitería Del Centro', 'delcentro@correo.test');

INSERT INTO helados (nombre, precio) VALUES
    ('Pote 1 kg',       12000),
    ('Pote 1/2 kg',      6800),
    ('Pote 1/4 kg',      3900),
    ('Palito de agua',    900),
    ('Bombón helado',    1500),
    ('Torta helada',    18500);

INSERT INTO pedidos (fecha, cliente) VALUES
    (DATE '2026-03-02', 1), (DATE '2026-03-02', 2), (DATE '2026-03-03', 3), (DATE '2026-03-04', 4),
    (DATE '2026-03-05', 5), (DATE '2026-03-06', 1), (DATE '2026-03-09', 2), (DATE '2026-03-10', 3),
    (DATE '2026-03-11', 4), (DATE '2026-03-12', 5), (DATE '2026-03-13', 1), (DATE '2026-03-16', 2);

INSERT INTO contiene (pedido, helado, cantidad, precio_unitario) VALUES
    (1, 1, 2, 12000), (1, 4, 20, 900),
    (2, 1, 4, 12000), (2, 6, 1, 18500),
    (3, 2, 6, 6800),  (3, 5, 24, 1500),
    (4, 4, 60, 900),  (4, 5, 30, 1500),
    (5, 3, 10, 3900), (5, 6, 2, 18500),
    (6, 1, 1, 12000), (6, 4, 30, 900),
    (7, 1, 3, 12000), (7, 2, 2, 6800),
    (8, 5, 12, 1500),
    (9, 4, 80, 900),
    (10, 6, 3, 18500), (10, 3, 5, 3900),
    (11, 2, 4, 6800),
    (12, 1, 5, 12000), (12, 6, 1, 18500);

-- Correcciones posteriores sobre pedidos ya registrados
UPDATE contiene SET cantidad = 40 WHERE pedido = 4 AND helado = 4;
UPDATE pedidos  SET total = total + 2000 WHERE idpedido = 9;
