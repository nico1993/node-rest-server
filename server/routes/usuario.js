const express = require('express');
const bcrypt = require('bcrypt');
const _ = require('underscore');
const app = express();
const Usuario = require('../models/usuario');

app.get('/usuario', function (req, res) {

    let desde = req.query.desde || 0;
    desde = Number(desde);

    let limite = req.query.limite || 5;
    limite = Number(limite);

    Usuario.find({estado: true})
    .select(['nombre', 'email'])
    .skip(desde)
    .limit(limite)
    .exec((err, usuarios) => {
        if(err) {
            return res.status(400).json({
                ok: false,
                err
            })
        }

        Usuario.count({estado: true}, (err, count) => {
            res.json({
                ok: true,
                usuarios,
                meta: {
                    total: count
                }
            });
        });
    });
});

app.post('/usuario', function (req, res) {
    let body = req.body;

    let usuario = new Usuario({
        nombre: body.nombre,
        email: body.email,
        password: bcrypt.hashSync(body.password, 10),
        // img: body.img
        role: body.role
    });
    
    usuario.save((err, usuarioDB) => {
        if(err) {
            return res.status(400).json({
                ok: false,
                err
            })
        }

        // usuarioDB.password = null;

        res.json({
            ok: true,
            usuario: usuarioDB
        });
    });
});

app.put('/usuario/:id', function (req, res) {
    let id = req.params.id;
    let body = _.pick(req.body, ['nombre', 'email', 'img', 'role', 'estado']);

    Usuario.findByIdAndUpdate(id, body, {new: true, runValidators: true}, (err, usuarioDB) => {
        if(err) {
            return res.status(400).json({
                ok: false,
                err
            })
        }
        res.json({
            ok: true,
            usuario: usuarioDB
        });
    });
});

app.delete('/usuario/:id', function (req, res) {
    let id = req.params.id;

    Usuario.findByIdAndUpdate(id, {estado: false}, (err, usuarioDB) => {
        if(err) {
            return res.status(400).json({
                ok: false,
                err
            })
        }

        if(!usuarioDB) {
            return res.status(400).json({
                ok: false,
                err: {message: 'Usuario no encontrado'}
            });
        }
        
        res.json({
            ok: true,
            message: 'Usuario eliminado correctamente'
        });
    });

    // Usuario.findByIdAndRemove(id, (err, borrado) => {
    //     if(err) {
    //         return res.status(400).json({
    //             ok: false,
    //             err
    //         });
    //     }

    //     if(!borrado) {
    //         return res.status(400).json({
    //             ok: false,
    //             err: {message: 'Usuario no encontrado'}
    //         });
    //     }

    //     res.json({
    //         ok: true,
    //         usuario: borrado
    //     });
    // });
});

module.exports = app;