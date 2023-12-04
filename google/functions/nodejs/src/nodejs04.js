const fs = require("fs");
const {v4: uuidv4} = require('uuid');
const path = require("path");
const {Storage} = require('@google-cloud/storage');

const storage = new Storage();

const BUCKET_NAME = "storage_benchmark";

function generateRandomData() {
    return Buffer.from(Math.random().toString(36).substring(2, 15));
}

deleteFile = async (BUCKET_NAME, KEY) => {
    const bucket = storage.bucket(BUCKET_NAME);
    const file = bucket.file(KEY);

    await file.delete();

    console.log(`File deleted successfully: gs://${BUCKET_NAME}/${KEY}`);
}

putFile = async (BUCKET_NAME, KEY, DATA) => {
    const bucket = storage.bucket(BUCKET_NAME);
    const file = bucket.file(KEY);

    await file.save(DATA);

    console.log(`File uploaded successfully: gs://${BUCKET_NAME}/${KEY}`);

}

GCPStorageBenchmark = async () => {
    const filesToGenerate = 15;
    const fileNames = [];
    const promises = [];
    let fileName;


    for (let i = 0; i < filesToGenerate; i++) {
        fileName = `random_file_${uuidv4()}.txt`;
        fileNames.push(fileName);

        promises.push(putFile(BUCKET_NAME, `/tmp/${fileName}`, generateRandomData()));
    }
    await Promise.all(promises);

    fileNames.forEach(file => promises.push(deleteFile(BUCKET_NAME, `/tmp/${file}`)))
    await Promise.all(promises);

    return {
        success: true,
        payload: {
            test: 'GCPStorageBenchmark',
        },
    };
}


module.exports = {
    GCPStorageBenchmark
}
