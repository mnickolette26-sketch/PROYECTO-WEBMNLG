// 1. Importamos las librerías que instalamos previamente
const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const PORT = 3000; // El servidor correrá en el puerto 3000

// 2. Configuración para que Node pueda leer los datos de los formularios HTML
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// 3. Configuración de la conexión a la Base de Datos MySQL
const conexion = mysql.createConnection({
    host: '127.0.0.1',      // Su servidor local (XAMPP)
    user: 'root',           // Usuario por defecto de XAMPP
    password: '',           // Contraseña por defecto (vacía en XAMPP)
    database: 'sistema_usuarios' // El nombre exacto que le pusimos a la base de datos
});

// 4. Conectar físicamente a la base de datos
conexion.connect((error) => {
    if (error) {
        console.error('Error al conectar a la base de datos MySQL:', error);
    } else {
        console.log('¡Conexión exitosa a la base de datos MySQL con XAMPP!');
    }
});

// 5. Indicarle al servidor que muestre el archivo HTML cuando entremos a la página
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// 6. Iniciar el servidor y dejarlo escuchando peticiones
app.listen(PORT, () => {
    console.log(`Servidor corriendo en el enlace: http://localhost:${PORT}`);
});