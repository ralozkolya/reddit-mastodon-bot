const { mastodonAccessToken: access_token } = process.env;

const Promise = require('bluebird');
const request = require('request');
const Masto = require('mastodon');

const client = new Masto({
    access_token,
    api_url: 'http://mastodon.local/api/v1/'
});

const postPromise = Promise.promisify(client.post, { context: client });

async function postStatus(post) {

    if (!post) {
        return;
    }

    const { id } = await postPromise('/media', {
        file: request(post.url)
    });

    return postPromise('/statuses', {
        status: post.title,
        media_ids: [ id ]
    });
}


module.exports = { postStatus };
