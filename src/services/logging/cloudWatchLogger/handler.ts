import { getLogsFromLastMinutes } from '@libs/cloudwatch';
import { updateValue } from '@libs/dynamoDB';
import { extractJsonFromLogEvent } from '@libs/jsonExtractor';

const cwLogger = async (event) => {
  try {
    const logs = await getLogsFromLastMinutes(event.logGroupName);
    const extractedLogs = logs.map(extractJsonFromLogEvent).filter((item) => item !== null);
    extractedLogs.map(saveLog);

    return {
      statusCode: 200,
      body: 'Lambda executed successfully',
      logs: extractedLogs,
    };
  } catch (error) {
    console.error('Error:', error);
    return {
      statusCode: 500,
      body: 'An error occurred',
    };
  }
}

const saveLog = async (log) => {
  const updatedItem = await updateValue("ExecutionLogTable", { "requestId": log.requestId }, log);
  return updatedItem
}

export const main = cwLogger 