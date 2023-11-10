const fs = require("fs");
const rimraf = require("rimraf");

fileSystemBenchmark = async (req, res) => {
    let n, size;
    let rnd = Math.floor(Math.random() * 900000) + 100000;

    if (req.query && req.query.n) {
        n = req.query.n;
    } else {
        n = 10000;
    }

    if (req.query && req.query.size) {
        size = req.query.size;
    } else {
        size = 10240;
    }

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

    let startWrite = Date.now();
    for (let i = 0; i < n; i++) {
        fs.writeFileSync('/tmp/test/' + rnd + '/' + i + '.txt', text, 'utf-8');
    }
    let endWrite = Date.now();

    let startRead = Date.now();
    for (let i = 0; i < n; i++) {
        var test = fs.readFileSync('/tmp/test/' + rnd + '/' + i + '.txt', 'utf-8');
    }
    let endRead = Date.now();

    let files = fs.readdirSync('/tmp/test/' + rnd);

    if (fs.existsSync('/tmp/test/' + rnd)) {
        rimraf.sync('/tmp/test/' + rnd);
    }

    return {
        success: files.length == n,
        payload: {
            "test": "filesystem test",
            "n": files.length,
            "size": Number(size),
            "timewrite": (endWrite - startWrite).toFixed(3),
            "timeread": (endRead - startRead).toFixed(3),
        }
    };
};

module.exports = {
    fileSystemBenchmark
}
