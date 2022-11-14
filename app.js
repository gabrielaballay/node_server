const debug = require('debug')('app:inicio');
// const debugDB = require('debug')('app:db');

const express = require('express');
const config = require('config');
const usuarios = require('./routes/usuarios.js');
// const log = require('./logger');
const morgan = require('morgan');
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
app.use(express.static('public'));
app.use('/api/usuarios', usuarios);

// Configuracion de entornos
console.log("Aplicación: " + config.get("nombre"));
console.log("BD Server: " + config.get('configDB.host'));

// Uso Middleware de terceros
// Registro de peticiones HTTP
if (app.get('env') === 'development') {
    app.use(morgan('tiny'));
    // console.log("Morgan habilitado");
    debug('Morgan esta habilitado...')
}

// debug BBDD
debug('Conectado con la BBDD');
// app.use(log);

app.get('/', (req, res) => {
    res.send('Hola Mundo');
});


const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Escuchando Puerto ${port}`));
