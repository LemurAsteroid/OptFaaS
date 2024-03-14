import {middify} from "@libs/logger";
import * as fs from 'fs';
import {rimraf} from 'rimraf';
import {BenchmarkFunction} from "@models/model";
import {wrapperFunction} from "@libs/wrapper";

const fileSystemBenchmark:BenchmarkFunction = () => {
    let n = 10000;
    let size=  10240;
    let rnd = Math.floor(Math.random() * 900000) + 100000;


    let text = '';

    for (let i = 0; i < size; i++) {
        text += 'A';
    }

    if (!fs.existsSync('/tmp/test')) {
        fs.mkdirSync('/tmp/test');
    }

    if (!fs.existsSync('/tmp/test/' + rnd)) {
        fs.mkdirSync('/tmp/test/' + rnd);
    }


    for (let i = 0; i < n; i++) {
        fs.writeFileSync('/tmp/test/' + rnd + '/' + i + '.txt', text, 'utf-8');
    }

    for (let i = 0; i < n; i++) {
        fs.readFileSync('/tmp/test/' + rnd + '/' + i + '.txt', 'utf-8');
    }


    let files = fs.readdirSync('/tmp/test/' + rnd);

    if (fs.existsSync('/tmp/test/' + rnd)) {
        rimraf.sync('/tmp/test/' + rnd);
    }

    return files.length == n;
};

const wNodejs = async (event, context) => {
    return await wrapperFunction(fileSystemBenchmark, event, context);
}

export const main = middify(wNodejs, "nodejs02");
