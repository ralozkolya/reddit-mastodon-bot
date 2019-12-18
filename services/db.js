const { host, database, username: user, password } = process.env;

const knex = require('knex')({
    client: 'mysql',
    connection: {
        host, database, user,  password, charset: 'utf8mb4'
    },
});

async function getFiltered(list = []) {
    let ids = await knex('shown')
        .select('id')
        .whereIn('id', list.map(post => post.id));
    ids = ids.map(id => id.id);

    return list.filter(post => !ids.includes(post.id));
}

function store({ id, title, url }) {
    return knex('shown').insert({ id, title, url });
}

module.exports = { knex, store, getFiltered };
