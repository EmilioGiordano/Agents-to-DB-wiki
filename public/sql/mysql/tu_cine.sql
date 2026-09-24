-- =====================================================================
-- Tu Cine: esquema y datos de ejemplo (MySQL 8.0.16 o superior, MariaDB 10.4 o superior)
-- Guía «Agentes de IA y bases de datos», Laboratorio de Bases de Datos
--
-- Uso:
--   mysql -u root -p -e "CREATE DATABASE cadena_cines CHARACTER SET utf8mb4"
--   mysql -u root -p cadena_cines < tu_cine.sql
--
-- El volumen de datos (unas 140 000 entradas) es suficiente para observar
-- diferencias reales en los planes de ejecución. Los datos contienen, a
-- propósito, algunas inconsistencias que se utilizan en los ejercicios
-- de los capítulos 1, 6 y 8 de la guía.
-- =====================================================================

SET NAMES utf8mb4;

DROP TABLE IF EXISTS entradas, funciones, butacas, salas, peliculas, cines, numeros, digitos;

-- ---------------------------------------------------------------------
-- Esquema
-- ---------------------------------------------------------------------

CREATE TABLE cines (
    idcine      INTEGER      NOT NULL AUTO_INCREMENT PRIMARY KEY,
    cod_cine    INTEGER      NOT NULL UNIQUE,
    email       VARCHAR(45)  NOT NULL UNIQUE,
    nombre      VARCHAR(45)  NOT NULL,
    calle       VARCHAR(45)  NOT NULL,
    num_calle   VARCHAR(20)  NOT NULL,
    ciudad      VARCHAR(45)  NOT NULL,
    telefono    VARCHAR(50)  NOT NULL
);

CREATE TABLE peliculas (
    idpelicula  INTEGER      NOT NULL AUTO_INCREMENT PRIMARY KEY,
    cod_peli    INTEGER      NOT NULL UNIQUE,
    titulo      VARCHAR(255) NOT NULL UNIQUE,
    director    VARCHAR(255) NOT NULL,
    genero      VARCHAR(45)  NOT NULL,
    CONSTRAINT ck_peliculas_genero CHECK (genero IN (
        'DRAMA', 'COMEDIA', 'THRILLER', 'ACCION', 'CIENCIA FICCION', 'TERROR',
        'MUSICAL', 'AVENTURA', 'DOCUMENTAL', 'ANIMACION', 'POLICIAL'))
);

CREATE TABLE salas (
    idsala          INTEGER      NOT NULL AUTO_INCREMENT PRIMARY KEY,
    cod_sala        INTEGER      NOT NULL,
    tamano_pantalla NUMERIC(4,1),
    cant_butacas    INTEGER      NOT NULL DEFAULT 0 CHECK (cant_butacas >= 0), -- columna calculada
    cine            INTEGER      NOT NULL,
    CONSTRAINT fk_salas_cines FOREIGN KEY (cine) REFERENCES cines (idcine),
    CONSTRAINT uq_salas UNIQUE (cod_sala, cine)
);

CREATE TABLE butacas (
    idbutaca    INTEGER NOT NULL AUTO_INCREMENT PRIMARY KEY,
    fila        INTEGER NOT NULL CHECK (fila BETWEEN 1 AND 40),
    asiento     INTEGER NOT NULL CHECK (asiento BETWEEN 1 AND 30),
    sala        INTEGER NOT NULL,
    CONSTRAINT fk_butacas_salas FOREIGN KEY (sala) REFERENCES salas (idsala),
    CONSTRAINT uq_butacas UNIQUE (fila, asiento, sala)
);

CREATE TABLE funciones (
    idfuncion   INTEGER NOT NULL AUTO_INCREMENT PRIMARY KEY,
    fecha       DATE    NOT NULL,
    hora        TIME    NOT NULL,
    pelicula    INTEGER NOT NULL,
    sala        INTEGER NOT NULL,
    CONSTRAINT fk_funciones_peliculas FOREIGN KEY (pelicula) REFERENCES peliculas (idpelicula),
    CONSTRAINT fk_funciones_salas FOREIGN KEY (sala) REFERENCES salas (idsala),
    CONSTRAINT uq_funciones UNIQUE (fecha, hora, pelicula, sala)
);

CREATE TABLE entradas (
    identrada   INTEGER       NOT NULL AUTO_INCREMENT PRIMARY KEY,
    butaca      INTEGER       NOT NULL,
    funcion     INTEGER       NOT NULL,
    importe     NUMERIC(10,2) NOT NULL,
    fecha_venta DATETIME      NOT NULL,
    CONSTRAINT fk_entradas_butacas FOREIGN KEY (butaca) REFERENCES butacas (idbutaca),
    CONSTRAINT fk_entradas_funciones FOREIGN KEY (funcion) REFERENCES funciones (idfuncion),
    CONSTRAINT uq_entradas UNIQUE (funcion, butaca)
);

-- ---------------------------------------------------------------------
-- Datos
-- ---------------------------------------------------------------------

-- Tablas auxiliares de dígitos y números (0 a 999)
CREATE TABLE digitos (d INTEGER PRIMARY KEY);
INSERT INTO digitos (d) VALUES (0),(1),(2),(3),(4),(5),(6),(7),(8),(9);

CREATE TABLE numeros (n INTEGER PRIMARY KEY);
INSERT INTO numeros (n)
SELECT c.d * 100 + d.d * 10 + u.d
FROM digitos c
CROSS JOIN digitos d
CROSS JOIN digitos u;

INSERT INTO cines (cod_cine, email, nombre, calle, num_calle, ciudad, telefono) VALUES
    (101, 'centro@tucine.com.ar',   'Tu Cine Centro',   'Rivadavia',  '1250', 'Junín',        '0236 442-1100'),
    (102, 'shopping@tucine.com.ar', 'Tu Cine Shopping', 'Av. Libertad', '480', 'Pergamino',   '02477 43-2200'),
    (103, 'plaza@tucine.com.ar',    'Tu Cine Plaza',    'San Martín', '75',   'Chivilcoy',    '02346 42-3300');

INSERT INTO peliculas (cod_peli, titulo, director, genero) VALUES
    (1, 'El secreto de sus ojos', 'Juan José Campanella', 'DRAMA'),
    (2, 'Relatos salvajes',       'Damián Szifron',       'COMEDIA'),
    (3, 'Nueve reinas',           'Fabián Bielinsky',     'POLICIAL'),
    (4, 'Argentina, 1985',        'Santiago Mitre',       'DRAMA'),
    (5, 'El aura',                'Fabián Bielinsky',     'THRILLER'),
    (6, 'Metegol',                'Juan José Campanella', 'ANIMACION'),
    (7, 'La historia oficial',    'Luis Puenzo',          'DRAMA'),
    (8, 'El clan',                'Pablo Trapero',        'POLICIAL'),
    (9, 'Zama',                   'Lucrecia Martel',      'DRAMA'),
    (10, 'Muerte en Buenos Aires', 'Natalia Meta',        'THRILLER'),
    (11, 'Esperando la carroza',  'Alejandro Doria',      'COMEDIA'),
    (12, 'Aterrados',             'Demián Rugna',         'TERROR');

-- Cuatro salas por cine
INSERT INTO salas (cod_sala, tamano_pantalla, cine)
SELECT s.n, 8.0 + s.n, c.idcine
FROM cines c
CROSS JOIN numeros s
WHERE s.n BETWEEN 1 AND 4
ORDER BY c.idcine, s.n;

-- Butacas: 10 filas por 15 asientos en cada sala
INSERT INTO butacas (fila, asiento, sala)
SELECT f.n, a.n, s.idsala
FROM salas s
CROSS JOIN numeros f
CROSS JOIN numeros a
WHERE f.n BETWEEN 1 AND 10
  AND a.n BETWEEN 1 AND 15
ORDER BY s.idsala, f.n, a.n;

-- Columna calculada: cantidad de butacas por sala
UPDATE salas
SET cant_butacas = (SELECT COUNT(*) FROM butacas b WHERE b.sala = salas.idsala);

-- Funciones: 60 días, cuatro horarios, todas las salas
INSERT INTO funciones (fecha, hora, pelicula, sala)
SELECT DATE_ADD(DATE '2026-03-02', INTERVAL d.n DAY),
       h.hora,
       ((d.n + s.idsala) % 12) + 1,
       s.idsala
FROM numeros d
CROSS JOIN salas s
CROSS JOIN (SELECT TIME '15:00:00' AS hora
            UNION ALL SELECT TIME '17:30:00'
            UNION ALL SELECT TIME '20:00:00'
            UNION ALL SELECT TIME '22:30:00') AS h
WHERE d.n < 60
ORDER BY 1, 2, 4;

-- Entradas: aproximadamente un tercio de las butacas de cada función
INSERT INTO entradas (butaca, funcion, importe, fecha_venta)
SELECT b.idbutaca,
       f.idfuncion,
       CASE WHEN f.hora >= TIME '20:00:00' THEN 6500 ELSE 5000 END,
       TIMESTAMP(DATE_SUB(f.fecha, INTERVAL ((b.idbutaca + f.idfuncion) % 5) DAY), '09:00:00')
         + INTERVAL ((b.idbutaca * 13) % 360) MINUTE
FROM funciones f
JOIN butacas b ON b.sala = f.sala
WHERE (b.idbutaca * 7 + f.idfuncion) % 3 = 0
ORDER BY f.idfuncion, b.idbutaca;

-- Incidencias históricas (utilizadas en los ejercicios del capítulo 6)
INSERT INTO funciones (fecha, hora, pelicula, sala)
VALUES (DATE '2026-03-14', TIME '20:00:00', 12, 5);

INSERT INTO entradas (butaca, funcion, importe, fecha_venta)
SELECT (SELECT MIN(idbutaca) FROM butacas WHERE sala = 2),
       (SELECT MIN(idfuncion) FROM funciones WHERE sala = 1 AND fecha = DATE '2026-03-20' AND hora = TIME '20:00:00'),
       6500,
       TIMESTAMP '2026-03-20 18:42:00';

UPDATE salas SET cant_butacas = 140 WHERE cod_sala = 3 AND cine = 2;

DROP TABLE numeros, digitos;

ANALYZE TABLE cines, peliculas, salas, butacas, funciones, entradas;
