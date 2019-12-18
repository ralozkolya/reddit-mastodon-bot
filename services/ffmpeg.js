const { path: ffmpegPath } = require('@ffmpeg-installer/ffmpeg');
const os = require('os');
const path = require('path');
const uuid = require('uuid/v1');
const request = require('request');
const { createWriteStream, promises: { unlink } } = require('fs');
const streamToPromise = require('stream-to-promise');
const { promisify } = require('util');
const { exec } = require('child_process');

const execPromise = promisify(exec);

async function convertVideo(url) {
    return convert(url, '-pix_fmt yuv420p -codec libx264');
}

async function convertPhoto(url) {
    return convert(url, `-vf "scale='min(1980,iw)':-1"`);
}

async function convert(url, command) {

    const ext = path.parse(url).ext || '.mp4';
    const tempOriginal = path.join(os.tmpdir(), uuid() + ext);
    const tempPath = path.join(os.tmpdir(), uuid() + ext);

    const ws = createWriteStream(tempOriginal);
    await streamToPromise(request(url).pipe(ws));

    await execPromise(`${ffmpegPath} -i ${tempOriginal} ${command}  ${tempPath}`);

    unlink(tempOriginal);

    return tempPath;
}

module.exports = { convertVideo, convertPhoto };