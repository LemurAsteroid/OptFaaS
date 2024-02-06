const projectName = 'optfaas';

async function fetchLogs(client, metrics, functionData) {
    let logs = [];
    let metricLogPromises = [];
    metrics.forEach(metric => metricLogPromises.push(fetchExecutionMetrics(client, functionData, metric)));
    await Promise.all(metricLogPromises).then(log => logs.push(log));
    return combineLog(logs[0], functionData);
}

/**
 * Fetch execution time and memory usage of another Google Cloud Function (GCF) for the past 10 minutes.
 *
 * @param client
 * @param functionData
 * @param metric
 */
async function fetchExecutionMetrics(client, functionData, metric) {
    const request = {
        name: client.projectPath(projectName),
        filter: `metric.type="${metric.FILTER}" ${metric.STATE} AND resource.labels.function_name="${functionData.ufunctionId}" AND resource.labels.region="${functionData.region}"`,
        interval: {
            startTime: {
                seconds: Date.now() / 1000 - 60 * 10,
            },
            endTime: {
                seconds: Date.now() / 1000,
            },
        },
        aggregation: {
            alignmentPeriod: {
                seconds: 10,
            },
            perSeriesAligner: metric.ALIGN,
            crossSeriesReducer: metric.REDUCE,
        },
    };

        // const res = await client.listTimeSeries(request);
    const res = await client.listTimeSeries(request);

    return extractMetrics(res, metric.DATA_TYPE);
}

function extractMetrics(data, dataType) {
    try {
        if (Array.isArray(data)) {
            const extractedData = [];
            for (const obj of data) {
                if (obj && Array.isArray(obj)) {
                    for (const element of obj) {
                        if (element && element.points) {
                            for (const point of element.points) {
                                extractedData.push({
                                    timestamp: point.interval.startTime.seconds,
                                    value: dataType === 'DOUBLE' ? point.value.doubleValue : point.value.int64Value
                                })
                            }
                        }
                    }
                }
            }
            return extractedData;
        } else {
            console.error('Input is not an array.');
        }
    } catch (error) {
        console.error('Error parsing JSON:', error.message);
    }
}


function combineLog(logs, functionData) {
    const combinedLogs = {};


    logs[0].forEach(entry1 => {
        let foundValues = [];
        const timestamp1 = entry1.timestamp;
        logs.forEach(log => foundValues.push(findClosestEntry(log, timestamp1).value));

        combinedLogs[timestamp1] = {foundValues};
    });

    const csvRows = Object.entries(combinedLogs).map(([timestamp, log]) => {
        return `${convertToISO(timestamp)},${log.foundValues.join(',')},${functionData.ufunctionId},${functionData.region}`;
    });

    return csvRows.join('\n');
}


function convertToISO(timestamp) {
    return new Date(Number(timestamp) * 1000).toISOString()
}


function findClosestEntry(data, targetTimestamp) {
    return data.reduce((closest, current) => {
        const closestDiff = Math.abs(targetTimestamp - closest.timestamp);
        const currentDiff = Math.abs(targetTimestamp - current.timestamp);
        return currentDiff < closestDiff ? current : closest;
    });
}


module.exports = {
    fetchLogs
}
