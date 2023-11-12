import * as path from 'path';
import {spawn} from 'child_process';
import * as os from 'os';
import {S3} from 'aws-sdk';
import * as ffmpegPath from '@ffmpeg-installer/ffmpeg';
import {BenchmarkFunction} from "@models/model";

// const ffmpegPath = require('@ffmpeg-installer/ffmpeg').path;

const ffmpeg = ffmpegPath.path;
const s3 = new S3();

const BUCKET_NAME = 'video_benchmark_bucket';
const VIDEO_NAME = 'SampleVideo_1280x720_1mb.mp4';


export const convertVideoToGif:BenchmarkFunction = () => {
    const tmpDir = os.tmpdir();
    const tempLocalFile = path.join(tmpDir, VIDEO_NAME);
    const tempLocalGif = path.join(tmpDir, `${path.basename(VIDEO_NAME, path.extname(VIDEO_NAME))}.gif`);

    // Download the video from GCP to a temporary directory
    downloadFromS3(BUCKET_NAME, VIDEO_NAME, tempLocalFile);
    console.log('MP4 downloaded successfully.');

    // Convert the video to GIF using FFmpeg
    const ffmpegProcess = spawn(ffmpeg, [
        '-i', tempLocalFile,
        '-vf', 'fps=10,scale=320:-1:flags=lanczos',
        tempLocalGif,
    ]);

    ffmpegProcess.on('error', (err) => {
        console.error('Error during spawn:', err);
    });

    new Promise((resolve, reject): void => {
        ffmpegProcess.on('close', (code) => {
            if (code === 0) {
                // Upload the GIF to S3
                uploadToS3(BUCKET_NAME, `converted/${path.basename(tempLocalGif)}`, tempLocalGif)
                    .then(() => {
                        console.log('GIF uploaded successfully.');
                        resolve("success");
                    })
                    .catch((err) => {
                        console.error('Error uploading GIF:', err);
                        reject(err);
                    });
            } else {
                console.error('FFmpeg process failed with code ' + code);
                reject(new Error('FFmpeg process failed'));
            }
        });
    });

    return true;
};

function downloadFromS3(bucket: string, key: string, localFilePath: string): Promise<void> {
    const params = {
        Bucket: bucket,
        Key: key,
    };

    const s3Stream = s3.getObject(params).createReadStream();
    const localStream = require('fs').createWriteStream(localFilePath);

    return new Promise((resolve, reject) => {
        s3Stream.on('error', (err) => reject(err));
        localStream.on('error', (err) => reject(err));
        localStream.on('finish', () => resolve());

        s3Stream.pipe(localStream);
    });
}


function uploadToS3(bucket: string, key: string, localFilePath: string) {
    const params = {
        Bucket: bucket,
        Key: key,
        Body: require('fs').createReadStream(localFilePath),
    };

    return s3.upload(params).promise();
}


/*
Test JSON:
{
    "numberOfParallelExecutions": 12,
    "region": "US",
    "functionName": "xyz",
    "executionId": "test"
}
 */
