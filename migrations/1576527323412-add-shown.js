const { knex } = require('../services/db');

async function up () {
    await knex.transaction(async trx => {
        await trx.schema.createTable('shown', table => {
            table.string('id', 10).notNullable().primary();
            table.string('title', 256);
            table.timestamp('created_at').notNullable()
                .defaultTo(knex.raw('CURRENT_TIMESTAMP'));
            table.timestamp('updated_at').notNullable()
                .defaultTo(knex.raw('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'));
        });
    });
}

async function down () {
    await knex.schema.dropTable('shown');
}

module.exports = { up, down };
