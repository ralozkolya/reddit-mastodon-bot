const { path: ffmpegPath } = require('@ffmpeg-installer/ffmpeg');
const os = require('os');
const path = require('path');
const uuid = require('uuid/v1');
const request = require('request');
const { createWriteStream, unlink } = require('fs');
const streamToPromise = require('stream-to-promise');
const { promisify } = require('util');
const { exec } = require('child_process');

async function convertVideo(url) {
    return convert(url, '-pix_fmt yuv420p -codec libx264', '.mp4');
}

async function convertPhoto(url) {
    return convert(url, `-vf "scale='min(1980,iw)':-1"`);
}

async function convert(url, command, ext) {

    ext = ext || (path.parse(url).ext || '.jpg');
    const tempOriginal = path.join(os.tmpdir(), uuid() + ext);
    const tempPath = path.join(os.tmpdir(), uuid() + ext);

    const ws = createWriteStream(tempOriginal);
    await streamToPromise(request(url).pipe(ws));

    try {
        await promisify(exec)(`${ffmpegPath} -v quiet -y -i ${tempOriginal} ${command}  ${tempPath}`);
    } finally {
        promisify(unlink)(tempOriginal);
    }

    return tempPath;
}

module.exports = { convertVideo, convertPhoto };
