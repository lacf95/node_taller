const bookshelf = require('../bookshelf');
const Habilidades = require('./habilidades');

module.exports = bookshelf.Model.extend({
  tableName: 'asistentes',
  habilidades: function() {
    return this.hasMany(Habilidades);
  }
});
