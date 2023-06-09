const mysql = require('mysql');

const conexionBD = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root'
});

conexionBD.connect((err) => {
    if(err) throw err;
    console.log('Connected! :)');
});

conexionBD.query('DROP DATABASE IF EXISTS festgangs;', (err, result) => {
    if (err) throw err;
    console.log('Result: ' + result);
});

conexionBD.query('CREATE DATABASE festgangs;', (err, result) => {
    if (err) throw err;
    console.log('Base de datos creada con éxito');
});

conexionBD.query('DROP TABLE IF EXISTS festgangs.usertype;', (err, result) => {
    if (err) throw err;
    console.log('Result: ' + result);
});

conexionBD.query('DROP TABLE IF EXISTS festgangs.user;', (err, result) => {
    if (err) throw err;
    console.log('Result: ' + result);
});

conexionBD.query('DROP TABLE IF EXISTS festgangs.event;', (err, result) => {
    if (err) throw err;
    console.log('Result: ' + result);
});

conexionBD.query('DROP TABLE IF EXISTS festgangs.eventgroup;', (err, result) => {
    if (err) throw err;
    console.log('Result: ' + result);
});

conexionBD.query('DROP TABLE IF EXISTS festgangs.usergroup;', (err, result) => {
    if (err) throw err;
    console.log('Result: ' + result);
});

conexionBD.query('DROP TABLE IF EXISTS festgangs.groupcomment;', (err, result) => {
    if (err) throw err;
    console.log('Result: ' + result);
});

const crearTablaUserType = 'CREATE TABLE festgangs.usertype (' +
                            'id INT AUTO_INCREMENT PRIMARY KEY,' +
                            'name VARCHAR(30) NOT NULL,' +
                            'description TEXT)';

conexionBD.query(crearTablaUserType, (err, result) => {
    if(err) throw err;
    console.log('Tabla usertype creada con éxito');
});

const llenarTablaUserType = 'INSERT INTO festgangs.usertype (name, description) VALUES ' +
                            "('standard', 'Poderes: crear perfil personal, organizar/partcipar en grupos/eventos, buscar información sobre estos'), " +
                            "('administrator', 'Poderes: editar eventos, gestionar usuarios')";

conexionBD.query(llenarTablaUserType, (err, result) => {
    if (err) throw err;
    console.log('Tabla userType rellenada con éxito');
});

const crearTablaUser = 'CREATE TABLE festgangs.user (' +
                    'id INT AUTO_INCREMENT PRIMARY KEY,' +
                    'type INT NOT NULL DEFAULT 1,' +
                    'email VARCHAR(50) NOT NULL,' +
                    'name VARCHAR(30) NOT NULL,' +
                    'password VARCHAR(30) NOT NULL,' +
                    'profile_photo BOOL NOT NULL DEFAULT 0,' +
                    'bio VARCHAR(500),' +
                    'artists VARCHAR(500),' +
                    'genres VARCHAR(500),' +
                    'FOREIGN KEY (type) REFERENCES usertype(id)' +
                    ');';

//console.log(crearTablaUser);

conexionBD.query(crearTablaUser, (err, result) => {
    if (err) throw err;
    console.log('Tabla user creada con éxito');
});

const llenarTablaUser = 'INSERT INTO festgangs.user (type, email, name, password, profile_photo) VALUES' +
                    "(1, 'ana@gmail.com', 'Ana29', '1234', 1)," +
                    "(1, 'juan@gmail.com', 'juan_guay', '1234', 0)," +
                    "(1, 'carlos@gmail.com', 'charless', '1234', 1)," +
                    "(1, 'matilda@gmail.com', 'Mtilda', '1234', 1)," +
                    "(2, 'admin@gmail.com', 'Admin', '1234', 0)";

console.log(llenarTablaUser);

conexionBD.query(llenarTablaUser, (err, result) => {
    if (err) throw err;
    console.log('Tabla user rellenada con éxito');
});

const crearTablaEvent = 'CREATE TABLE festgangs.event (' +
                    'id INT AUTO_INCREMENT PRIMARY KEY,' +
                    'title VARCHAR(50) NOT NULL,' +
                    'artist TEXT NOT NULL,' +
                    'city VARCHAR(50) NOT NULL,' +
                    'country VARCHAR(50) NOT NULL,' +
                    'location VARCHAR(100),' +
                    'date DATE NOT NULL' +
                    ');';

conexionBD.query(crearTablaEvent, (err, result) => {
    if (err) throw err;
    console.log('Tabla event creada con éxito');
});

const llenarTablaEvent = 'INSERT INTO festgangs.event (title, artist, city, country, location, date) VALUES' +
                            "('Hombres G', 'Hombres G', 'Gijón', 'España', 'Palacio de Deportes Presidente Adolfo Suárez', '2023-06-09')," +
                            "('Skinyz', 'Skinyz', 'Gijón', 'España', 'Billy Bob', '2023-06-10')," +
                            "('Riverland 2023', 'Sticky M.A., Yung Beef, C.R.O, Delaossa, Cruz Cafuné, Kidd Keo', 'Arriondas', 'España', 'Valle de la Música', '2023-08-24')," +
                            "('Tsunami Xixón', 'Wolfmother, Dropkick Murphys, Descendents, Me First And TheGimme Gimmes, The Hellacopters, Toundra, Desakato', 'Gijón', 'España', 'Laboral Ciudad de la Cultura', '2023-07-27');";

conexionBD.query(llenarTablaEvent, (err, result) => {
    if (err) throw err;
    console.log('Tabla event rellenada con éxito');
});

const crearTablaEventGroup = 'CREATE TABLE festgangs.eventgroup (' +
                    'id INT AUTO_INCREMENT PRIMARY KEY, ' +
                    'event_id INT NOT NULL, ' +
                    'leader INT NOT NULL, ' +
                    'max_users INT NOT NULL check (max_users BETWEEN 2 AND 50), ' +
                    'FOREIGN KEY (event_id) REFERENCES event(id), ' +
                    'FOREIGN KEY (leader) REFERENCES user(id)' +
                    ');';

conexionBD.query(crearTablaEventGroup, (err, result) => {
    if (err) throw err;
    console.log('Tabla eventgroup creada con éxito');
});

const crearTablaUserGroup = 'CREATE TABLE festgangs.usergroup (' +
                    'user_id INT, ' +
                    'group_id INT, ' +
                    'PRIMARY KEY (user_id, group_id), ' +
                    'FOREIGN KEY (user_id) REFERENCES user(id), ' +
                    'FOREIGN KEY (group_id) REFERENCES eventgroup(id)' +
                    ');';

conexionBD.query(crearTablaUserGroup, (err, result) => {
    if (err) throw err;
    console.log('Tabla usergroup creada con éxito');
});

const crearTablaGroupComment = 'CREATE TABLE festgangs.groupcomment (' +
                    'id INT AUTO_INCREMENT PRIMARY KEY, ' +
                    'user_id INT NOT NULL, ' +
                    'group_id INT NOT NULL, ' +
                    'created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, ' +
                    'content VARCHAR(500) NOT NULL, ' +
                    'FOREIGN KEY (user_id) REFERENCES user(id), ' +
                    'FOREIGN KEY (group_id) REFERENCES eventgroup(id)' +
                    ');';

conexionBD.query(crearTablaGroupComment, (err, result) => {
    if (err) throw err;
    console.log('Tabla groupcomment creada con éxito');
});