import { LambdaClient } from "@aws-sdk/client-lambda";
import { invoke } from "@libs/invoker";
import { middify } from "@libs/logger";
import { AWS_REGIONS } from "variables";
import * as console from "console";
const benchmarkRunner = async (event) => {
    const promises = []
    const payload = event.payload;
    console.log(event);

    const client: LambdaClient = new LambdaClient({ region: AWS_REGIONS[payload.sregion] });

    for (let i = 0; i < payload.numberOfParallelExecutions; i++) {
        promises.push(invoke(
            client,
            `optFaas-nodejs-dev-${payload.ufunctionId}`,
            {
                numberOfParallelExecutions: payload.numberOfParallelExecutions,
                sregion: AWS_REGIONS[payload.sregion],
            }));
    }
    
    const response = await Promise.all(promises)
    return {
        statusCode: 200,
        body: 'Lambda executed successfully',
        response: response,
    };
};

export const main = middify(benchmarkRunner, "optFaas-dev-benchmarkRunner");
