import {middify} from "@libs/logger";
import {wrapperFunction} from "@libs/wrapper";
import * as Handlebars from 'handlebars';
import * as fs from 'fs/promises';
import * as path from 'path';
import * as util from 'util';

const readFileAsync = util.promisify(fs.readFile);

function random(b: number, e: number): number {
    return Math.round(Math.random() * (e - b) + b);
}

const webAppBenchmark = async () => {
    const numRequests = 100; // Number of requests to send
    const randomLen = 10; // Length of the random_numbers array
    const username = 'Guest';

    const benchmarkResults: string[] = [];

    for (let i = 0; i < numRequests; i++) {
        const random_numbers = new Array(randomLen);
        for (let j = 0; j < randomLen; j++) {
            random_numbers[j] = random(0, 100);
        }

        const input = {
            cur_time: new Date().toLocaleString(),
            username,
            random_numbers,
        };

        try {
            const file = path.resolve(__dirname, 'src', 'template.handlebars');
            const data = await readFileAsync(file, 'utf-8');
            const template = Handlebars.compile(data);

            template(input);

            const endTime = process.hrtime();
            const elapsedTimeInMs = (endTime[0] * 1000 + endTime[1] / 1e6).toFixed(2);

            benchmarkResults.push(`Request ${i + 1}: ${elapsedTimeInMs}ms`);
        } catch (error) {
            benchmarkResults.push(`Request ${i + 1} failed: ${error.message}`);
        }
    }

    return true;
};


const wNodejs = async (event, context) => {
    return await wrapperFunction(webAppBenchmark, event, context);
}

export const main = middify(wNodejs, "nodejs03");
