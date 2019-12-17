const { access_token, mastodon_host } = process.env;

const request = require('request');
const Masto = require('mastodon');

const client = new Masto({
    access_token,
    api_url: mastodon_host
});

async function postStatus(post) {

    if (!post) {
        return;
    }

    const { data: { id } } = await client.post('/media', {
        file: request(post.url),
        focus: '0,1'
    });

    return client.post('/statuses', {
        status: post.title,
        media_ids: [ id ]
    });
}


module.exports = { postStatus };
