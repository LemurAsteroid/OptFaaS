const Handlebars = require('handlebars');
const fs = require('fs').promises;
const path = require('path');

function random(b, e) {
    return Math.round(Math.random() * (e - b) + b);
}

webAppBenchmark = async () => {
    const numRequests = 100;
    const randomLen = 10;
    const username = 'Guest';

    const benchmarkResults= [];

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
            const file = path.resolve('src/', 'template.handlebars');
            const data = await fs.readFile(file,'utf8');
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

module.exports = {
    webAppBenchmark
}
