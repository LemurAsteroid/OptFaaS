const now = require('performance-now');
const fs = require("fs");
const {safeLogs} = require("./libs/storage");
const {matrixMultiplication} = require('./src/nodejs01');
const {fileSystemBenchmark} = require("./src/nodejs02");
const {convertVideoToGif} = require("./src/nodejs03");
const {webAppBenchmark} = require("./src/nodejs04");
const {nodeFactors} = require("./src/nodejs05");

exports.nodejs01 = async (req, res) => {
    await wrapperFunction(matrixMultiplication, req, res);
    return 0;
}

exports.nodejs02 = async (req, res) => {
    await wrapperFunction(fileSystemBenchmark, req, res);
}

exports.nodejs03 = async (req, res) => {
    await wrapperFunction(convertVideoToGif, req, res);
}

exports.nodejs04 = async (req, res) => {
    await wrapperFunction(webAppBenchmark, req, res);
}

exports.nodejs05 = async (req, res) => {
    await wrapperFunction(nodeFactors, req, res);
}


const wrapperFunction = async (benchmarkFunction, req, res) => {
    const timeStamp = new Date().toDateString();

    const start = now();
    const response = await benchmarkFunction();
    const end = now();

    if (!response) {
        res.set("Content-Type", "application/json");
        res.status(500);
        res.send(JSON.stringify({error: "error during execution"}));
        return;
    }

    const logs = {
        functionCategory: benchmarkFunction.name,
        functionName: req.body.functionName || null,
        executionId: req.body.executionId || null,
        language: 'nodejs',
        sregion: req.body.region || null,
        numberOfParallelExecutions: req.body.numberOfParallelExecutions || null,
        provider: 'GCP',
        memoryLimitInMB: null,
        startupTime: null,
        coldStart: null,
        timeStamp: timeStamp,
        executionTime: Number((end - start).toFixed(3))
    };

    await safeLogs(logs);
    res.set("Content-Type", "application/json");
    res.status(200);
    res.send(JSON.stringify(logs));
}
