const { Storage } = require('@google-cloud/storage');
const sharp = require('sharp');
const uuid = require('uuid');
const {unlinkSync} = require("fs");

const BUCKET_NAME = "image_benchmark_bucket";
const IMAGE_NAME = "benchmark_image_5mb.jpg";

const storage = new Storage();

resizeImage = async (event, context) => {
    const file = storage.bucket(BUCKET_NAME).file(IMAGE_NAME);
    const tempFilePath = `/tmp/${uuid.v4()}-${IMAGE_NAME}`;

    // Download the image to a temporary file
    await file.download({ destination: tempFilePath });

    // Resize the image
    const resizedImageName = `${uuid.v4()}-resized.jpg`;
    const resizedImagePath = `/tmp/${resizedImageName}`;
    await sharp(tempFilePath)
        .resize({ width: 300, height: 300 })
        .toFile(resizedImagePath);

    // Upload the resized image back to the bucket
    await storage.bucket(BUCKET_NAME).upload(resizedImagePath, {
        destination: `resized/${resizedImageName}`,
    });

    // Cleanup: Delete the temporary files
    await Promise.all([storage.bucket(BUCKET_NAME).file(`resized/${resizedImageName}`).delete(), sharp.cache(false)]);
    console.log(`Image ${IMAGE_NAME} resized and uploaded with random name ${resizedImageName}.`);

    // Delete temporary files
    unlinkSync(tempFilePath);
    unlinkSync(resizedImagePath);

    return {
        success: true,
        payload: {
            "test": "convertVideoToGifBenchmark"
        }
    }
};


module.exports = {
    resizeImage
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
