const { Storage } = require('@google-cloud/storage');

safeLogs = async (log, bucketName = 'execution_logs', fileName = 'execution_log.json') => {
    const logJson = JSON.stringify(log, null, 2);

    await uploadToGCS(bucketName, fileName, logJson);

    console.log(`Log uploaded to GCS bucket ${bucketName} with file name ${fileName}`);
}

async function uploadToGCS(bucketName, fileName, content) {
    // Create a GCS client
    const storage = new Storage();

    // Get the GCS bucket
    const bucket = storage.bucket(bucketName);

    // Create a GCS file with the specified file name
    const file = bucket.file(fileName);

    // Upload content to the file
    await file.save(content);

    console.log(`Log uploaded to GCS bucket ${bucketName} with file name ${fileName}`);
}

module.exports = {
    safeLogs
}
