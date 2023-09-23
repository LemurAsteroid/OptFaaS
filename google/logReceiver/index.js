// const { MetricServiceClient } = require('@google-cloud/monitoring');
// Imports the Google Cloud client library
const monitoring = require('@google-cloud/monitoring');

// Creates a client
const client = new monitoring.MetricServiceClient();

const projectId = 'optfaas';
const functionName = 'nodejs02';
const startTime = new Date('2023-16-09T16:38:00Z');
const filter = 'metric.type="compute.googleapis.com/instance/cpu/utilization"';

// const client = new MetricServiceClient();

// startTime should be specified in req.body
exports.metricReceiver = async (req, res) => {

  const request = {
    name: client.projectPath(projectId),
    filter: filter,
    // `resource.type="cloud_function" AND resource.labels.function_name="${functionName}"`,
    // 'metric.type="cloudfunctions.googleapis.com/function/execution_times"',
    interval: {
      /* startTime: {
        seconds: Date.now() / 1000 - 60 * 60,  // Convert milliseconds to seconds
      }, */
      endTime: {
        seconds: Date.now() / 1000,  // Convert milliseconds to seconds
      }
    }

  };

  try {
    const [timeSeries] = await client.listTimeSeries(request);

    // Process and analyze timeSeries data to extract execution info
    timeSeries.forEach(data => {
      console.log(`${data.metric.labels.instance_name}:`);
      data.points.forEach(point => {
        console.log(JSON.stringify(point.value));
      });
    });
    console.log(timeSeries);
  } catch (err) {
    console.error('Error retrieving execution info:', err);
  }
}
