import { LambdaClient } from "@aws-sdk/client-lambda";
import { invoke } from "@libs/invoker";
import { middify } from "@libs/logger";
import {AWS_REGIONS, CompleteFunctionName} from "variables";
import * as console from "console";
const benchmarkRunner = async (event) => {
    const promises = []
    const payload = event.payload;
    const numberOfParallelExecutions = payload.ufunctionId == 'nodejs03' || payload.ufunctionId == 'java02' ? (payload.numberOfParallelExecutions / 3) : payload.numberOfParallelExecutions
    console.log(event);

    const client: LambdaClient = new LambdaClient({ region: AWS_REGIONS[payload.sregion] });

    for (let i = 0; i < numberOfParallelExecutions; i++) {
        promises.push(invoke(
            client,
            CompleteFunctionName[payload.ufunctionId],
            {
                numberOfParallelExecutions: numberOfParallelExecutions,
                sregion: AWS_REGIONS[payload.sregion],
            }));
    }
    
    await Promise.all(promises)
    return {
        statusCode: 200,
        body: `Function ${payload.ufunctionId} was invoked ${payload.numberOfParallelExecutions} times`
    };
};

export const main = middify(benchmarkRunner, "optFaas-dev-benchmarkRunner");
