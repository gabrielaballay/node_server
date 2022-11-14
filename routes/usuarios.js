const express = require('express');
const Joi = require('joi');
const ruta = express.Router();

const usuarios = [
    { id: 1, nombre: "Gabriel" },
    { id: 2, nombre: "Luis" },
    { id: 3, nombre: "Ana" }
]

ruta.get('/', (req, res) => {
    res.send(usuarios);
});

ruta.get('/:id', (req, res) => {
    //res.send(req.params.id)
    //res.send(req.query)
    // var resp = usuarios.find(d => d.id === parseInt(req.params.id));
    let usuario = existUser(parseInt(req.params.id));
    if (!usuario) res.status(404).send("Usuario no encontrado!")
    else res.send(usuario);
});

ruta.post('/', (req, res) => {
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

ruta.put('/:id', (req, res) => {
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

ruta.delete('/:id', (req, res) => {
    let usuario = existUser(parseInt(req.params.id));
    if (!usuario) res.status(404).send("Usuario no encontrado!");

    const index = usuarios.indexOf(usuario);
    usuarios.splice(index, 1);
    res.send(usuario);
});

function existUser(id) {
    return (usuarios.find(d => d.id === id));
}

function validateUser(nom) {
    const schema = Joi.object({
        nombre: Joi.string().min(3).max(30).required(),
    });
    return (schema.validate({ nombre: nom }));
}

module.exports = ruta;