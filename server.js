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

// Configuración para que Express reconozca la carpeta actual y sus archivos estáticos
app.use(express.static(__dirname));

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

// 5.5 RUTA PARA PROCESAR EL REGISTRO DE USUARIOS
app.post('/registrar', (req, res) => {
    // Capturamos los datos que el usuario escribió en el formulario HTML
    const { nombre, email, password } = req.body;

    // Creamos la consulta SQL para insertar los datos en la tabla 'usuarios'
    const consultaSQL = 'INSERT INTO usuarios (nombre, email, password) VALUES (?, ?, ?)';

    // Ejecutamos la consulta en la base de datos
    conexion.query(consultaSQL, [nombre, email, password], (error, resultado) => {
        if (error) {
            console.error('Error al insertar el usuario:', error);
            res.send('Hubo un error al registrar el usuario. Intente nuevamente.');
        } else {
            console.log('¡Usuario registrado con éxito en MySQL!');
            // Le enviamos una respuesta visual simple al navegador del usuario
           res.redirect('/');
        }
    });
});

// 5.7 RUTA PARA PROCESAR EL INICIO DE SESIÓN (LOGIN)
app.post('/login', (req, res) => {
    // Capturamos el correo y contraseña ingresados por el usuario
    const { email, password } = req.body;

    // Buscamos en la base de datos si existe un usuario con ese correo y esa contraseña
    const consultaSQL = 'SELECT * FROM usuarios WHERE email = ? AND password = ?';

    conexion.query(consultaSQL, [email, password], (error, resultados) => {
        if (error) {
            console.error('Error al consultar el usuario:', error);
            res.send('Hubo un error en el servidor.');
        } else {
            // Si los resultados son mayores a 0, significa que se encontró una coincidencia exacta
            if (resultados.length > 0) {
                console.log('¡Inicio de sesión aprobado!');
                // Le enviamos la pantalla del catálogo de poleras
                res.sendFile(path.join(__dirname, 'catalogo.html'));
            } else {
                // Si no coincide, le avisamos al usuario
                res.send('<h1>Error de acceso</h1><p>El correo o la contraseña son incorrectos.</p><a href="/">Intentar de nuevo</a>');
            }
        }
    });
});

// 6. Iniciar el servidor y dejarlo escuchando peticiones
app.listen(PORT, () => {
    console.log(`Servidor corriendo en el enlace: http://localhost:${PORT}`);
});