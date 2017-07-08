const knexFile = require('./knexfile');

function knexEnv() {
  if (process.env.NODE_ENV) {
    return knexFile[process.env.NODE_ENV];
  } else {
    return knexFile.development;
  }
}

const knex = require('knex')(knexEnv());

const bookshelf = require('bookshelf')(knex);

module.exports = bookshelf;
