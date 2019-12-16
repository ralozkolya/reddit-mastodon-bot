require('dotenv').config();

const { getHot } = require('./services/reddit');
const { knex, store, getFiltered } = require('./services/db');
const { postStatus } = require('./services/mastodon');

(async () => {

    try {
        const posts = await getHot();
        const filtered = await getFiltered(posts);

        let status;
        do {

            try {
                const post = filtered.shift();
                status = await postStatus(post);
                await store(post);
                console.log(`Posted: ${post.title}`);
            } catch (e) {}

        } while (!status && posts.length);

    } catch (e) {
        console.error(e.message);
    }

    await knex.destroy();

})();
