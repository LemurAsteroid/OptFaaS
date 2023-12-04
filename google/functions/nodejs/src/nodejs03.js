const Jimp = require('jimp');
const {Storage} = require('@google-cloud/storage');

const BUCKET_NAME = 'image_benchmark_bucket';
const IMAGE_NAME = 'benchmark_image_1mb.jpg';

const storage = new Storage();

resizeImage = async (req, res) => {
    const originalImageBuffer = await getUint8Array(BUCKET_NAME, IMAGE_NAME);

    await Jimp.read(Buffer.from(originalImageBuffer))
        .then((image) => {
            return image
                .resize(300, 300)
                .greyscale();
        });

    return {
        success: true,
        payload: {
            test: 'convertVideoToGifBenchmark',
        },
    };
};

getUint8Array = async (bucketName, imageName) => {
    const file = storage.bucket(bucketName).file(imageName);

    // Download the file content as a buffer
    const fileBuffer = await file.download();

    // Convert the buffer to Uint8Array
    const uint8Array = new Uint8Array(fileBuffer[0]);

    return uint8Array;
};

module.exports = {
    resizeImage
}
