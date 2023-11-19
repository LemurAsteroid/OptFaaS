const monitoring = require('@google-cloud/monitoring');
const {fetchLogs} = require("./libs/log");
const {safeLogs} = require("./libs/storage");

const keyFilename = './credentials.json';

const BUCKET_NAME = "execution_logs";
const LOG_FILE_NAME = "execution_logs.csv";

const METRICS = [
    {
        METRIC_NAME: "ExecutionTime",
        FILTER: "cloudfunctions.googleapis.com/function/execution_times",
        ALIGN: 'ALIGN_DELTA',
        REDUCE: 'REDUCE_MEAN',
        DATA_TYPE: 'DOUBLE'
    },
    {
        METRIC_NAME: "ConcurrentExecutions",
        FILTER: "cloudfunctions.googleapis.com/function/execution_count",
        ALIGN: 'ALIGN_DELTA',
        REDUCE: 'ALIGN_SUM',
        DATA_TYPE: 'INT'
    },
    {
        METRIC_NAME: "ActiveInstances",
        FILTER: "cloudfunctions.googleapis.com/function/instance_count",
        ALIGN: 'ALIGN_COUNT',
        REDUCE: 'REDUCE_COUNT',
        DATA_TYPE: 'INT'
    },
    {
        METRIC_NAME: "MemoryUsage",
        FILTER: "cloudfunctions.googleapis.com/function/user_memory_bytes",
        ALIGN: 'ALIGN_DELTA',
        REDUCE: 'REDUCE_MEAN',
        DATA_TYPE: 'DOUBLE'
    }
]

const client = new monitoring.MetricServiceClient({
    keyFilename: keyFilename
});


exports.logFunction = async (req, res) => {
    const logs = await fetchLogs(client, METRICS, req.body.functionData);

    safeLogs(logs, BUCKET_NAME, LOG_FILE_NAME);
}
