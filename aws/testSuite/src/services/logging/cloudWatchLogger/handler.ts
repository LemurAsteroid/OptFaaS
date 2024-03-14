import {getLogsFromLastMinutes} from '@libs/cloudwatch';
import {extractJsonFromLogEvent, mapToCsv, storeInMap} from '@libs/jsonExtractor';
import * as console from "console";
import {putItem} from "@libs/s3";
import variables, {AWS_REGIONS, CompleteFunctionName} from "../../../../variables";

const cloudWatchLogger = async (event):Promise<Object> => {
    try {
        const logMap: Map<string, any[]> = new Map();
        const logGroupName = `/aws/lambda/${CompleteFunctionName[event.payload.ufunctionId]}`;

        await getLogsFromLastMinutes(logGroupName, AWS_REGIONS[event.payload.sregion], 6).then(cwLogs =>
            cwLogs.map(extractJsonFromLogEvent)
                .filter((item) => item !== null)
                .forEach(logRecord => storeInMap(logRecord, logMap))
        );
        console.log(logMap);

        logMap.forEach((value, key) => {
            if (value['billedDuration'] === undefined) logMap.delete(key)
        });
        await putItem(variables.LOG_BUCKET_NAME,`logs/${event.payload.ufunctionId}/LOG_${event.payload.sregion}_${new Date().toISOString()}.csv`, mapToCsv(logMap));

        return {
            statusCode: 200,
            body: 'Lambda executed successfully',
            logs: logMap
        };
    } catch (error) {
        console.error('Error:', error);
        return {
            statusCode: 500,
            body: 'An error occurred',
        };
    }
}

export const main = cloudWatchLogger
