const monitoring = require('@google-cloud/monitoring');
const {fetchLogs} = require("./libs/log");
const {safeLogs} = require("./libs/storage");

const keyFilename = './credentials.json';

const BUCKET_NAME = "execution_logs";
const HEADERS = "timestamp, executionTime, concurrentExecutions, activeInstances, memoryUsage, language, region \n"

const METRICS = [
    {
        METRIC_NAME: "ExecutionTime",
        FILTER: "cloudfunctions.googleapis.com/function/execution_times",
        ALIGN: 'ALIGN_DELTA',
        REDUCE: 'REDUCE_MEAN',
        DATA_TYPE: 'DOUBLE',
        STATE: ''
    },
    {
        METRIC_NAME: "ConcurrentExecutions",
        FILTER: "cloudfunctions.googleapis.com/function/execution_count",
        ALIGN: 'ALIGN_DELTA',
        REDUCE: 'ALIGN_SUM',
        DATA_TYPE: 'INT',
        STATE: ''
    },
    {
        METRIC_NAME: "ActiveInstances",
        FILTER: "cloudfunctions.googleapis.com/function/instance_count",
        // ALIGN: 'ALIGN_RATE',
        // REDUCE: 'REDUCE_SUM',
        DATA_TYPE: 'INT',
        STATE: 'AND metric.labels.state="active"'
    },
    {
        METRIC_NAME: "MemoryUsage",
        FILTER: "cloudfunctions.googleapis.com/function/user_memory_bytes",
        ALIGN: 'ALIGN_DELTA',
        REDUCE: 'REDUCE_MEAN',
        DATA_TYPE: 'DOUBLE',
        STATE: ''
    }
]

const client = new monitoring.MetricServiceClient({
    keyFilename: keyFilename
});

getLogFileName = (ufunctionId, region) => {
    return `${ufunctionId}/LOG_${region}_${new Date().toISOString()}.csv`;
}

exports.logFunction = async (req, res) => {
    const payload = {
        ufunctionId: req.body.ufunctionId,
        region: req.body.region
    }
    const logs = await fetchLogs(client, METRICS, payload);
    if (logs === "") return;

    const extendedLogs = HEADERS.concat(logs);
    console.log(extendedLogs);

    await safeLogs(extendedLogs, BUCKET_NAME, getLogFileName(payload.ufunctionId, payload.region));
}


