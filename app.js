const debug = require('debug')('app:inicio');
// const debugDB = require('debug')('app:db');

const express = require('express');
const config = require('config');
const Joi = require('joi');
// const log = require('./logger');
const morgan = require('morgan');
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
app.use(express.static('public'));

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

const usuarios = [
    { id: 1, nombre: "Gabriel" },
    { id: 2, nombre: "Luis" },
    { id: 3, nombre: "Ana" }
]

app.get('/', (req, res) => {
    res.send('Hola Mundo');
});

app.get('/api/usuarios', (req, res) => {
    res.send(usuarios);
});

app.get('/api/usuarios/:id', (req, res) => {
    //res.send(req.params.id)
    //res.send(req.query)
    // var resp = usuarios.find(d => d.id === parseInt(req.params.id));
    let usuario = existUser(parseInt(req.params.id));
    if (!usuario) res.status(404).send("Usuario no encontrado!")
    else res.send(usuario);
});

app.post('/api/usuarios', (req, res) => {
    let { error, value } = validateUser(req.body.nombre);

    if (!error) {
        const usuario = {
            id: usuarios.length + 1,
            nombre: value.nombre
        }
        usuarios.push(usuario);
        res.send(usuario);
    } else {
        const mensaje = error.details[0].message;
        res.status(400).send(mensaje);
    }
    //res.status(400).send('Debe ingresar un nombre, que tenga minimo 3 letras');
});

app.put('/api/usuarios/:id', (req, res) => {
    // var usuario = usuarios.find(d => d.id === parseInt(req.params.id));
    // let { error, value } = schema.validate({ nombre: req.body.nombre });
    let usuario = existUser(parseInt(req.params.id));
    if (!usuario) res.status(404).send("Usuario no encontrado!");
    let { error, value } = validateUser(req.body.nombre);

    if (error) {
        const mensaje = error.details[0].message;
        res.status(400).send(mensaje);
        return;
    }

    usuario.nombre = value.nombre;
    res.send(usuario);
});

app.delete('/api/usuarios/:id', (req, res) => {
    let usuario = existUser(parseInt(req.params.id));
    if (!usuario) res.status(404).send("Usuario no encontrado!");

    const index = usuarios.indexOf(usuario);
    usuarios.splice(index, 1);
    res.send(usuario);
})

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Escuchando Puerto ${port}`));


function existUser(id) {
    return (usuarios.find(d => d.id === id));
}

function validateUser(nom) {
    const schema = Joi.object({
        nombre: Joi.string().min(3).max(30).required(),
    });
    return (schema.validate({ nombre: nom }));
}