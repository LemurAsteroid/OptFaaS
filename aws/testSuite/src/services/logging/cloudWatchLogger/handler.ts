import {getLogsFromLastMinutes} from '@libs/cloudwatch';
import {extractJsonFromLogEvent, mapToCsv, storeInMap} from '@libs/jsonExtractor';
import * as console from "console";
import {putItem} from "@libs/s3";
import variables, {AWS_REGIONS, CWlogGroupName} from "../../../../variables";

/**
 * Asynchronous function for logging CloudWatch logs and storing them in an S3 bucket.
 *
 * @param {Object} event - The event object, typically representing an AWS Lambda event.
 * @returns {Promise<Object>} A promise that resolves to an object containing the response information.
 * @throws {Error} Throws an error if any issues occur during execution.
 *
 * @example
 * const event = {
 *   payload: {
 *     language: 'nodejs',
 *     sregion: 'us-central1',
 *     ufunctionId: 'exampleFunction'
 *   }
 * };
 * const result = await cwLogger(event);
 */
const cloudWatchLogger = async (event):Promise<Object> => {
    try {
        const logMap: Map<string, any[]> = new Map();
        const logGroupName = CWlogGroupName[event.payload.ufunctionId];

        await getLogsFromLastMinutes(logGroupName, AWS_REGIONS[event.payload.sregion]).then(cwLogs =>
            cwLogs.map(extractJsonFromLogEvent)
                .filter((item) => item !== null)
                .forEach(logRecord => storeInMap(logRecord, logMap))
        );
        console.log(logMap);
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
