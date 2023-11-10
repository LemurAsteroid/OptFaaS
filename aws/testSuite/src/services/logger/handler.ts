import { putValue } from "@libs/dynamoDB";
import type { ExecutionData } from "@models/model";

const logger = async (event, context, callback) => {

    const excecutionData: ExecutionData = {
        "requestId": event.payload.requestId,
        "logGroupName": event.payload.logGroupName,
        "logStreamName": event.payload.logStreamName,
        "functionName": event.payload.functionName,
        "memoryLimitInMB": event.payload.memoryLimitInMB,
        "language": event.payload.language,
        "sregion": event.payload.sregion
    }

    console.log(await putValue('ExecutionLogTable', event.payload))

    return 200
};

export const main = logger;
