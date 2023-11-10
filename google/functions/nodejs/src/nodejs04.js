const Mustache = require('mustache');
const fs = require('fs');
const path = require('path');
const util = require('util');
const readFileAsync = util.promisify(fs.readFile);

function random(b, e) {
    return Math.round(Math.random() * (e - b) + b);
}

webAppBenchmark = async (req, res) => {

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


    return {
        success: true,
        payload: {"benchmark": "webApp"}
    };
};


module.exports = {
    webAppBenchmark
}
