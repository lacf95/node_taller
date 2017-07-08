process.env.NODE_ENV = 'test';
const assert = require('assert');
const async = require('async');
const request = require('supertest');
const should = require('should');
const knex = require('../bookshelf').knex;
const app = require('../app');

describe('Regresa un número', () => {
  describe('Verifica un número sea correcto', () => {
    it('Debe regresar un número correcto', () => {
      assert.equal(3, 3);
    });
  });
});

describe('CRUD', () => {
  beforeEach(done => {
    knex('habilidades').del().then(() => {
      knex('asistentes').del().then(() => {
        done();
      });
    });
  });

  after(done => {
    knex('habilidades').del().then(() => {
      knex('asistentes').del().then(() => {
        done();
      });
    });
  });

  it('insersion', done => {
    request(app)
      .post('/crud/guardar')
      .set('X-Requested-With', 'XMLHttpRequest')
      .send({
        nombre: 'Luis Adrián',
        apellido: 'Chávez Fregoso',
        ocupacion: 'Desarrollador'
      })
      .expect(200)
      .expect('Content-Type', /json/)
      .end(function(err, res) {
        if (err) {
          return done(err);
        }
        res.body.should.have.property('nombre');
        res.body.should.have.property('id');
        res.body.should.have.property('apellido');
        res.body.should.have.property('ocupacion');
        done();
      });
  });

  it('Edicion de asistente', done => {
    async.waterfall([
      function(callback) {
        knex('asistentes').insert({
          nombre: 'Luis Adrián',
          apellido: 'Chávez Fregoso',
          ocupacion: 'Desarrollador'
        }).then(data => {
          callback(null, { id: data.pop() });
        });
      }, function(arg1, callback) {
        request(app)
          .post('/crud/editar')
          .set('X-Requested-With', 'XMLHttpRequest')
          .send({
            id: arg1.id,
            nombre: 'Luis'
          })
          .expect(200)
          .expect('Content-Type', /json/)
          .end(callback);
      }
    ], function(err, res) {
      if (err) {
        return done(err);
      }
      (res.body.nombre).should.be.equal('Luis');
      done();
    });
  });
});
