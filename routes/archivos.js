const express = require('express');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const papaparse = require('papaparse');
const async = require('async');
const Asistente = require('../models/asistentes');
const router = express.Router();
const upload = multer({
  dest: 'temporal/'
});

router.get('/subir', (req, res, next) => {
  res.render('ARCHIVOS_views/subir', {
    titulo: 'Subir archivo',
    cargado: false
  });
});

router.post('/guardar', upload.single('archivo'), (req, res, next) => {
  const fileObject = req.file;
  if (fileObject) {
    const source = fs.createReadStream(`./${fileObject.destination}${fileObject.filename}`);
    const destination = fs.createWriteStream(`./public/files/${fileObject.originalname}`);
    source.pipe(destination);
    source.on('end', () => {
      if (path.extname(fileObject.originalname).toLocaleLowerCase() == '.csv') {
        fs.readFile(`./public/files/${fileObject.originalname}`, 'utf8', (err, data) => {
          if (!err) {
            papaparse.parse(data, {
              header: true,
              comments: false,
              complete: function(results) {
                async.eachSeries(results.data, function iterate(item, callback) {
                  if (typeof item.Nombre !== 'undefined') {
                    let nombres = item.Nombre.split(' ');
                    let nombre = nombres.splice(2, nombres.length).join('');
                    let apellido = nombres.splice(0, 2).join(' ');
                    new Asistente().save({
                      nombre: nombre,
                      apellido: apellido,
                      ocupacion: item.Grado
                    }).then(model => {
                      if (model.get('id')) {
                        callback(null)
                      } else {
                        callback({ error: 'No se pudo insertar'});
                      }
                    });
                  } else {
                    callback({ error: 'No se pudo insertar'});
                  }
                }, function done(err) {
                  if (err)
                    return console.log(err);
                  else
                    console.log('Insersiones terminadas');
                });
              }
            });
          }
        });
      }
      res.render('ARCHIVOS_views/subir', {
        titulo: 'Subir archivo',
        cargado: true,
        nombreArchivo: `./${fileObject.originalname}`
      });
    });
    source.on('error', err => {
      res.json(err);
    });
    source.on('close', () => {
      fs.unlink(`./${fileObject.destination}${fileObject.filename}`, () => {
        console.log('Archivo eliminado');
      });
    })
  }
});

module.exports = router;
