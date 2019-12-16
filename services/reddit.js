const { id, accessToken } = process.env;
const { version } = require('../package');

const Swoowrap = require('snoowrap');

const client = new Swoowrap({ userAgent: `web:${id}:${version} (by /u/Kolyness)`, accessToken });

async function getHot(limit = 5) {

    let posts = await client.getSubreddit('funny').getHot({ limit: 15 });

    return posts.map(post => ({
        title: post.title,
        url: (post.secure_media && post.secure_media.reddit_video.fallback_url) || post.url,
        id: post.name,
    }));
}

module.exports = { getHot };
