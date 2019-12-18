const { createReadStream, promises: { unlink } } = require('fs');

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

    let url;

    if (post.video) {
        url = await convertVideo(post.video);
    } else {
        url = await convertPhoto(post.url);
    }

    const { data: { id } } = await client.post('/media', {
        file: createReadStream(url),
        focus: '0,1'
    });

    unlink(url);

    return client.post('/statuses', {
        status: post.title + '\n#funny',
        media_ids: [ id ]
    });
}


module.exports = { postStatus };
