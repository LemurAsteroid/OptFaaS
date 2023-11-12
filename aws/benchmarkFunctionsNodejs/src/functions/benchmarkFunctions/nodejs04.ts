import {BenchmarkFunction} from "@models/model";

const util = require('util');
const readFileAsync = util.promisify(fs.readFile);

import * as Mustache from 'mustache';
import * as fs from 'fs/promises';
import * as path from 'path';

function random(b, e) {
    return Math.round(Math.random() * (e - b) + b);
}

export const webAppBenchmark:BenchmarkFunction = () => {

    const numRequests = 100; // Number of requests to send
    const randomLen = 10; // Length of the random_numbers array
    const username ='Guest';

    const benchmarkResults = [];

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
            const file = path.resolve(__dirname, 'src', 'template.html');
            const data = await readFileAsync(file, 'utf-8');
            const startTime = process.hrtime();

            Mustache.render(data, input);

            const endTime = process.hrtime();
            const elapsedTimeInMs = (endTime[0] * 1000 + endTime[1] / 1e6).toFixed(2);

            benchmarkResults.push(`Request ${i + 1}: ${elapsedTimeInMs}ms`);
        } catch (error) {
            benchmarkResults.push(`Request ${i + 1} failed: ${error.message}`);
        }
    }


    return true;
};
