const bookshelf = require('../bookshelf');
const Asistente = require('./asistentes');

module.exports = bookshelf.Model.extend({
  tableName: 'habilidades',
  asistente: function() {
    return this.belongsTo(Asistente);
  }
});
