import {
    CloudWatchLogs,
    CloudWatchLogsClient,
    DescribeLogStreamsCommand,
    FilteredLogEvent,
    GetLogEventsCommand,
    LogStream,
    OutputLogEvent,
} from '@aws-sdk/client-cloudwatch-logs';
import { avoidThrottling, sleep } from './utils';

export const getExecutionLog = async (
    cloudwatchClient: CloudWatchLogsClient,
    functionName: string,
    requestId: string,
    executionStart?: number
) => {
    const logGroupName = `/aws/lambda/${functionName}`;
    for (let i = 0; i < 5; i++) {
        const logStreams = await getLogStreams(
            cloudwatchClient,
            logGroupName,
            executionStart
        );
        const logs = (
            await Promise.all(
                logStreams.map((logStream) =>
                    avoidThrottling(() =>
                        getLogs(
                            cloudwatchClient,
                            logGroupName,
                            logStream.logStreamName,
                            executionStart
                        )
                    )
                )
            )
        ).flat();
        const functionLogs = logs.filter((log) =>
            log.message.includes(requestId)
        );
        if (functionLogs.length) {
            return functionLogs;
        }
        await sleep(200);
    }
    return [];
};

export const getOldExecutionLog = async (
    cloudwatchClient: CloudWatchLogsClient,
    functionName: string,
    requestIds: string[],
    executionStart?: number,
    executionEnd?: number
) => {
    const logGroupName = `/aws/lambda/${functionName}`;
    const logStreams = await getLogStreams(
        cloudwatchClient,
        logGroupName,
        executionStart ?? 0,
        executionEnd ?? Date.now()
    );

    const logs = (
        await Promise.all(
            logStreams.map((logStream) =>
                getLogs(
                    cloudwatchClient,
                    logGroupName,
                    logStream.logStreamName,
                    executionStart
                )
            )
        )
    ).flat();
    const functionLogs = logs.filter((log) =>
        requestIds.some((requestId) => log.message.includes(requestId))
    );
    return functionLogs;
};

export const getLogStreams = async (
    cloudwatchClient: CloudWatchLogsClient,
    logGroupName: string,
    executionStart: number,
    executionEnd: number
) => {
    const response = await cloudwatchClient.send(
        new DescribeLogStreamsCommand({
            logGroupName,
            orderBy: 'LastEventTime',
            descending: true,
        })
    );
    return response.logStreams.reduce<LogStream[]>((res, value, index) => {
        if (index === 0) {
            res.push(value);
            return res;
        }
        if (
            value.lastEventTimestamp >= executionStart &&
            value.lastEventTimestamp <= executionEnd
        ) {
            res.push(value);
        }
        return res;
    }, []);
};

export const getLogs = async (
    cloudwatchClient: CloudWatchLogsClient,
    logGroupName: string,
    logStreamName: string,
    startTime?: number,
    endTime?: number,
    all = false
) => {
    const logs: OutputLogEvent[] = [];
    let { events, nextBackwardToken } = await cloudwatchClient.send(
        new GetLogEventsCommand({
            logGroupName,
            logStreamName,
        })
    );
    if (events) {
        logs.push(...events);
    }
    while (all && nextBackwardToken) {
        const { events: newEvents, nextBackwardToken: newNextBackwardToken } =
            await cloudwatchClient.send(
                new GetLogEventsCommand({
                    logGroupName,
                    logStreamName,
                    startTime,
                    endTime,
                })
            );
        if (nextBackwardToken === newNextBackwardToken) break;
        nextBackwardToken = newNextBackwardToken;
        logs.push(...(newEvents ?? []));
    }
    return logs;
};


export const getLogsFromLastMinutes = async (logGroupName: string): Promise<FilteredLogEvent[]> => {
    const cloudwatchlogs = new CloudWatchLogs({ region: 'us-east-1' });
    const endTime = new Date();
    const startTime = new Date(endTime - 1 * 60 * 1000); // 1 minutes ago

    const params = {
        logGroupName: logGroupName,
        startTime: startTime.getTime(),
        endTime: endTime.getTime(),
        limit: 5000,
    };

    try {
        const response = await cloudwatchlogs.filterLogEvents(params);
        return response.events;
    } catch (error) {
        console.error('Error retrieving CloudWatch Logs:', error);
        throw error;
    }
};

