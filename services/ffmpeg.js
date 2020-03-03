const { path: ffmpegPath } = require('@ffmpeg-installer/ffmpeg');
const os = require('os');
const path = require('path');
const uuid = require('uuid/v1');
const fetch = require('node-fetch');
const { createWriteStream, unlink } = require('fs');
const streamToPromise = require('stream-to-promise');
const { promisify } = require('util');
const { exec } = require('child_process');

async function convertVideo(url, audio = null) {
    return convert(url, '-pix_fmt yuv420p -c:v libx264 -c:a copy', '.mp4', audio);
}

async function convertPhoto(url) {
    return convert(url, `-vf "scale='min(1980,iw)':-1"`);
}

async function convert(url, command, ext, audio = null) {

    ext = ext || (path.parse(url).ext || '.jpg');
    const tempOriginal = path.join(os.tmpdir(), uuid() + ext);
    let tempAudio;
    const tempPath = path.join(os.tmpdir(), uuid() + ext);

    await download(url, tempOriginal);

    if (audio && ext === '.mp4') {
        const res = await fetch(audio);
        if (res.ok) {
            tempAudio = path.join(os.tmpdir(), uuid() + '.mp3');
            await download(audio, tempAudio);
            command = `-i ${tempAudio} ` + command;
        }
    }

    const asyncUnlink = promisify(unlink);

    try {
        await promisify(exec)(`${ffmpegPath} -v quiet -y -i ${tempOriginal} ${command}  ${tempPath}`);
    } finally {
        asyncUnlink(tempOriginal);
        if (tempAudio) asyncUnlink(tempAudio);
    }

    return tempPath;
}

async function download(src, dst) {
    const ws = createWriteStream(dst);
    const resource = await fetch(src);
    await streamToPromise(resource.body.pipe(ws));
    return dst;
}

module.exports = { convertVideo, convertPhoto };
