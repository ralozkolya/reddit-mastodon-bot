const { clientId, clientSecret, refreshToken } = process.env;
const { version } = require('../package');

const Swoowrap = require('snoowrap');

const client = new Swoowrap({
    userAgent: `web:${clientId}:${version} (by /u/Kolyness)`,
    clientId,
    clientSecret,
    refreshToken
});

async function getHot(limit = 25) {

    let posts = await client.getSubreddit('funny').getHot({ limit });

    return posts.map(post => {

        let video = null, audio = null;

        if (post.secure_media && post.secure_media.reddit_video && post.secure_media.reddit_video.fallback_url) {
            video = post.secure_media.reddit_video.fallback_url;
            audio = post.url + '/audio';
        }

        return {
            title: post.title,
            url: post.url,
            video, audio,
            id: post.name,
        };
    });
}

module.exports = { getHot };
