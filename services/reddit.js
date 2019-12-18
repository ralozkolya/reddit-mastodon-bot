const { clientId, clientSecret, refreshToken } = process.env;
const { version } = require('../package');

const Swoowrap = require('snoowrap');

const client = new Swoowrap({
    userAgent: `web:${clientId}:${version} (by /u/Kolyness)`,
    clientId,
    clientSecret,
    refreshToken
});

async function getHot(limit = 5) {

    let posts = await client.getSubreddit('funny').getHot({ limit: 25 });

    return posts.map(post => ({
        title: post.title,
        url: post.url,
        video: post.secure_media && post.secure_media.reddit_video && post.secure_media.reddit_video.fallback_url,
        id: post.name,
    }));
}

module.exports = { getHot };
