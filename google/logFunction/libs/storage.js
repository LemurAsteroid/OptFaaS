const {Storage} = require('@google-cloud/storage');

async function safeLogs(log, bucketName, fileName) {
    try {
        const storage = new Storage();

        // Create a write stream to append the CSV entry to the file
        const file = storage.bucket(bucketName).file(fileName);
        const stream = file.createWriteStream({
            metadata: {
                contentType: 'text/csv',
            },
        });

        // Append the CSV entry to the file
        stream.write(`${log}\n`);

        // Listen for the 'finish' event to know when the write operation is complete
        stream.on('finish', () => {
            console.log(`CSV entry stored to ${fileName} in ${bucketName} bucket.`);
        });

        // Close the write stream to complete the operation
        stream.end();

        await new Promise((resolve) => {
            stream.on('finish', resolve);
        });
    } catch (error) {
        console.error('Error appending CSV entry:', error);
    }
}

module.exports = {
    safeLogs
}
