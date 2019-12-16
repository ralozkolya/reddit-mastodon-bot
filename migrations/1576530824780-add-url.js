const { knex } = require('../services/db');

async function up () {
  await knex.schema.alterTable('shown', table => {
    table.string('url', 512).after('title');
  });
}

async function down () {
  await knex.schema.alterTable('shown', table => {
    table.dropColumn('url');
  });
}

module.exports = { up, down };
