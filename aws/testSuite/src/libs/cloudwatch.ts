import {CloudWatchLogs, FilteredLogEvent} from '@aws-sdk/client-cloudwatch-logs';

export const getLogsFromLastMinutes = async (logGroupName: string, region: string): Promise<FilteredLogEvent[]> => {
    const cloudwatchlogs = new CloudWatchLogs({region: region});
    const endTime = new Date();
    // @ts-ignore
    const startTime = new Date(endTime - 20 * 60 * 1000); // 1 minutes ago

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

