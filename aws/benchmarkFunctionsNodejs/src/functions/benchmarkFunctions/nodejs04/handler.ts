import {middify} from "@libs/logger";
import {wrapperFunction} from "@libs/wrapper";
import * as fs from "fs";
import { v4 as uuidv4 } from 'uuid';
import {deleteFile, putFile} from "@libs/s3";
import * as path from "path";

const BUCKET_NAME = "optfaas-resource-bucket";

function generateRandomData() {
        return Buffer.from(Math.random().toString(36).substring(2, 15));
}

async function uploadAndDeleteRandomFiles(): Promise<void> {
    const filesToGenerate = 15;
    const tempDir = '/tmp';
    const fileNames = [];
    const promises = [];
    let fileName;

    try {
        for (let i = 0; i < filesToGenerate; i++) {
            fileName = `random_file_${uuidv4()}.txt`;
            fileNames.push(fileName);

            promises.push(putFile(BUCKET_NAME, `/tmp/${fileName}`, generateRandomData()));
        }
        await Promise.all(promises);

        fileNames.forEach(file => promises.push(deleteFile(BUCKET_NAME, `/tmp/${file}`)))
        await Promise.all(promises);
    } catch (error) {
        console.error('Error:', error);
    } finally {
        // Cleanup: Delete temporary directory and files
        fs.readdirSync(tempDir).forEach((file) => {
            const filePath = path.join(tempDir, file);
            fs.unlinkSync(filePath);
        });
    }
}


const wNodejs = async (event, context) => {
    return await wrapperFunction(uploadAndDeleteRandomFiles, event, context);
}

export const main = middify(wNodejs, "nodejs04");
