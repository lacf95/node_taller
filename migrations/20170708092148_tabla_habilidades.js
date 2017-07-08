
exports.up = function(knex, Promise) {
  return knex.schema.createTable('habilidades', t => {
    t.increments('id').primary();
    t.integer('asistente_id').references('asistentes.id').unsigned();
    t.string('habilidad');
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTableIfExists('habilidades');
};
