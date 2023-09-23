import type { ExecutionLogCW } from '@models/model';
import { getExecutionLog } from '@libs/cloudwatch';
import { OutputLogEvent, EventMessage } from 'aws-sdk/clients/cloudwatchlogs';
import { putValue } from '@libs/dynamoDB';

const cwLogger = async (event) => {
  try {
    console.log('Lambda function triggered by CloudWatch Events schedule');
    console.log(event);

    const executionLogs: OutputLogEvent[] = await getExecutionLog(event.ufunctionId, event.executionStart, event.executionEnd)
    const averagedExecutionLogs: ExecutionLogCW = averageLogs(executionLogs)

    await saveLog(averagedExecutionLogs)

    return {
      statusCode: 200,
      body: 'Lambda executed successfully',
    };
  } catch (error) {
    console.error('Error:', error);
    return {
      statusCode: 500,
      body: 'An error occurred',
    };
  }
}

const averageLogs = (outputLogs: OutputLogEvent[]): ExecutionLogCW => {
  outputLogs.forEach(logElement => {
    console.log(logElement.message)
    const newLog = parseLogMessageToJson(logElement.message)
    console.log(newLog)
  });

  const log = {
    timestamp: outputLogs[0].timestamp,
  }
  return
}

const parseLogMessageToJson = (logMessage: EventMessage) => {
  const executionInfo = {};
  const parts = logMessage.split(', ');

  for (const part of parts) {
    const [key, value] = part.split(': ');
    executionInfo[key.trim()] = value.trim();
  }

  return executionInfo;
}

const saveLog = async (log: ExecutionLogCW) => {
  putValue("ExecutionLogTable", log)
}


export const main = cwLogger 