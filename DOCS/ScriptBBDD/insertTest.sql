

INSERT INTO instalaciones (ubicacion, telefono, localidad, principal) VALUES 
('Calle Mayor 1', '912345678', 'Madrid', TRUE),
('Calle Menor 2', '923456789', 'Barcelona', FALSE),
('Calle Media 3', '934567890', 'Valencia', TRUE);

INSERT INTO empresas (instalaciones, contacto, CIF, fecha_alta, id_instalacion) VALUES 
(1, 'Juan Perez', 'A12345678', '2023-08-01', 1),
(2, 'Maria Gomez', 'B87654321', '2023-08-05', 2),
(3, 'Carlos Ruiz', 'C11223344', '2023-08-10', 3);

INSERT INTO usuario (nombre, apellido, email, telefono, passwd, tipoUser) VALUES 
('Alberto', 'Lopez', 'alberto.lopez@gmail.com', '945678123', 'password123', 1),
('Beatriz', 'Fernandez', 'beatriz.fernandez@gmail.com', '912345670', 'passw0rd', 2),
('Carlos', 'Sanchez', 'carlos.sanchez@gmail.com', '923456780', 'abc12345', 1);

INSERT INTO da_alta (id_instalacion, id_usuario, fecha_alta) VALUES 
(1, 1, '2023-08-15'),
(2, 2, '2023-08-16'),
(3, 3, '2023-08-17');

INSERT INTO documentacion_propieatario (nominas, carnet, DNI) VALUES 
(LOAD_FILE('/path/to/nomina1.jpg'), LOAD_FILE('/path/to/carnet1.jpg'), '12345678A'),
(LOAD_FILE('/path/to/nomina2.jpg'), LOAD_FILE('/path/to/carnet2.jpg'), '87654321B'),
(LOAD_FILE('/path/to/nomina3.jpg'), LOAD_FILE('/path/to/carnet3.jpg'), '11223344C');


INSERT INTO documentacion_coche (permiso_circulacion, ficha_tecnica, ficha_verde, fecha_documentacion) VALUES 
(LOAD_FILE('/path/to/permiso1.jpg'), LOAD_FILE('/path/to/ficha1.jpg'), LOAD_FILE('/path/to/fichaVerde1.jpg'), '2023-08-20'),
(LOAD_FILE('/path/to/permiso2.jpg'), LOAD_FILE('/path/to/ficha2.jpg'), LOAD_FILE('/path/to/fichaVerde2.jpg'), '2023-08-21'),
(LOAD_FILE('/path/to/permiso3.jpg'), LOAD_FILE('/path/to/ficha3.jpg'), LOAD_FILE('/path/to/fichaVerde3.jpg'), '2023-08-22');


INSERT INTO compra_venta (fecha, comprador, vendedor, coche, id_documentacionPropietario, id_documentacionCoche) VALUES 
('2023-08-23', 'Alberto Lopez', 'Carlos Ruiz', 'Coche1', 1, 1),
('2023-08-24', 'Beatriz Fernandez', 'Alberto Lopez', 'Coche2', 2, 2),
('2023-08-25', 'Carlos Sanchez', 'Beatriz Fernandez', 'Coche3', 3, 3);


INSERT INTO coche (matricula, marca, modelo, tipo_combustible, tipo_cambio, kilometraje, año_matriculacion, id_documentacionCoche, id_compraVenta) VALUES 
('1234ABC', 'Toyota', 'Corolla', 'Gasolina', 'Manual', 15000, '2020-05-01', 1, 1),
('5678DEF', 'Ford', 'Focus', 'Diesel', 'Automático', 30000, '2019-03-10', 2, 2),
('9101GHI', 'Honda', 'Civic', 'Híbrido', 'Manual', 12000, '2021-07-15', 3, 3);


INSERT INTO compra (id_usuario, matricula) VALUES 
(1, '1234ABC'),
(2, '5678DEF'),
(3, '9101GHI');


INSERT INTO venta (id_usuario, matricula) VALUES 
(3, '1234ABC'),
(1, '5678DEF'),
(2, '9101GHI');


INSERT INTO propieatario (nombre, apellido, email, telefono, id_documentacion, matricula) VALUES 
('Alberto', 'Lopez', 'alberto.lopez@gmail.com', '945678123', 1, '1234ABC'),
('Beatriz', 'Fernandez', 'beatriz.fernandez@gmail.com', '912345670', 2, '5678DEF'),
('Carlos', 'Sanchez', 'carlos.sanchez@gmail.com', '923456780', 3, '9101GHI');




