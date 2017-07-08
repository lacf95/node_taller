const express = require('express');
const router = express.Router();
const bookshelf = require('../bookshelf');
const Asistente = require('../models/asistentes');
// Obtener la instancia de knex, la app funciona mejor con una única instancia
//const knex = bookshelf.knex;

router.get('/nuevo', (req, res, next) => {
  res.render('CRUD_views/nuevo', {
    titulo: 'Registro asistente'
  });
});

router.get('/editar/:id', (req, res, next) => {
  new Asistente({ id: req.params.id }).fetch().then(model => {
    res.render('CRUD_views/editar', {
      titulo: 'Editar asistente',
      asistente: model.toJSON()
    });
  });
});

router.post('/guardar', (req, res, next) => {
  new Asistente().save(req.body).then(model => {
    if (req.xhr) {
      res.json(model.toJSON());
    } else {
      res.redirect('/crud/asistentes');
    }
  });
});

router.get('/asistentes', (req, res, next) => {
  new Asistente().fetchAll({ withRelated: ['habilidades']}).then(model => {
    res.render('CRUD_views/asistentes', {
      titulo: 'Lista de asistentes',
      asistentes: model.toJSON()
    });
  });
});

router.post('/editar', (req, res, next) => {
  new Asistente(req.body).save().then(model => {
    if (req.xhr) {
      res.json(model.toJSON());
    } else {
      res.redirect('/crud/asistentes');
    }
  });
});

router.delete('/eliminar/:id', (req, res, next) => {
  new Asistente({ id: req.params.id }).destroy().then(model => {
    res.json({ deleted: true });
  }).catch(err => {
    res.json({ deleted: false });
  });
});

module.exports = router;
