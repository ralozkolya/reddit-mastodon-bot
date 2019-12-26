const { createReadStream, unlink } = require('fs');
const { promisify } = require('util');

const { convertVideo, convertPhoto } = require('./ffmpeg');
const { access_token, mastodon_host } = process.env;

const Masto = require('mastodon');

const client = new Masto({
    access_token,
    api_url: mastodon_host
});

async function postStatus(post) {

    if (!post) {
        return;
    }

    let url, id;

    if (post.video) {
        url = await convertVideo(post.video);
    } else {
        url = await convertPhoto(post.url);
    }

    try {
        ({ data: { id } } = await client.post('/media', {
            file: createReadStream(url),
            focus: '0,1'
        }));
    } finally {
        promisify(unlink)(url);
    }

    return client.post('/statuses', {
        status: post.title + '\n#funny',
        media_ids: [ id ]
    });
}


module.exports = { postStatus };
