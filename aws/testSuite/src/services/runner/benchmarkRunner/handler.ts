import { LambdaClient } from "@aws-sdk/client-lambda";
import { invoke } from "@libs/invoker";
import { middify } from "@libs/logger";
import { AWS_REGIONS } from "variables";
const benchmarkRunner = async (event) => {
    const promises = []

    const client: LambdaClient = new LambdaClient({ region: AWS_REGIONS[event.payload.sregion] });

    for (let i = 0; i < event.payload.numberOfParallelExecutions; i++) {
        promises.push(invoke(
            client,
            `optFaas-dev-benchmarkFunction${event.payload.ufunctionId}`,
            {
                numberOfParallelExecutions: event.payload.numberOfParallelExecutions,
                language: "nodejs",
                sregion: event.payload.sregion,
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
