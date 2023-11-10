const path = require('path');
const { spawn } = require('child_process');
const os = require('os');

const { Storage } = require('@google-cloud/storage');
const fs = require("fs");

const ffmpegPath = require('@ffmpeg-installer/ffmpeg').path;

const ffmpeg = ffmpegPath;
const storage = new Storage();

const BUCKET_NAME = 'video_benchmark_bucket';
const VIDEO_NAME = 'benchmark_sample_video.mp4';


convertVideoToGif = async (req) => {
    const tmpDir = os.tmpdir();
    const file = storage.bucket(BUCKET_NAME).file(VIDEO_NAME);
    const tempLocalFile = path.join(tmpDir, VIDEO_NAME);
    const tempLocalGif = path.join(tmpDir, `${path.basename(VIDEO_NAME, path.extname(VIDEO_NAME))}.gif`);

    // Download the video from GCP to a temporary directory
    await file.download({ destination: tempLocalFile });

    // Convert the video to GIF using FFmpeg
    const ffmpegProcess = spawn(ffmpeg, [
        '-i', tempLocalFile,
        '-vf', 'fps=10,scale=320:-1:flags=lanczos',
        tempLocalGif,
    ]);

    await new Promise((resolve, reject) => {
        ffmpegProcess.on('close', (code) => {
            if (code === 0) {
                // Upload the GIF to GCP
                storage.bucket(BUCKET_NAME).upload(tempLocalGif, {
                    destination: `converted/${path.basename(tempLocalGif)}`,
                }, (err) => {
                    if (err) {
                        console.error('Error uploading GIF:', err);
                        reject(err);
                    } else {
                        console.log('GIF uploaded successfully.');
                        resolve();
                    }
                });
            } else {
                console.error('FFmpeg process failed with code ' + code);
                reject(new Error('FFmpeg process failed'));
            }
        });
    });

    return {
        success: true,
        payload: {
            "test": "convertVideoToGifBenchmark"
        },
    };
};

module.exports = {
    convertVideoToGif
}
