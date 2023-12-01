import {logExecutionData} from "@libs/logger";
import * as console from "console";

export const wrapperFunction = async (benchmarkFunction, event, context) => {
    logExecutionData(event, context);

    const response = await benchmarkFunction();

    const resourceUsage = process.resourceUsage();

    resourceUsage['requestId'] = context.awsRequestId;

    console.log(resourceUsage);

    return {
        statusCode: 200,
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            success: true,
            payload: response,
            resourceUsage: resourceUsage,
        })
    };
}
