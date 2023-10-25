import { LambdaClient } from "@aws-sdk/client-lambda";
import { invoke } from "@libs/invoker";
import { variables, AWS_REGIONS } from 'variables';


/**
 * Asynchronously schedules and invokes benchmark functions in multiple regions and logs the results.
 *
 * This function iterates over a list of regions and benchmark function IDs, scheduling and invoking
 * the specified benchmark functions with the provided parameters. It also logs the execution results
 * by invoking the 'optFaas-dev-cwLogger' function in the 'us-east-1' region.
 *
 * @returns {Promise} A Promise that resolves to an object containing the status code, a success message,
 * and the response from invoking the benchmark functions.
 */
const scheduleBenchmarkFunctions = async () => {
    const promises = []

    variables.REGION.forEach(sregion => {
        const client: LambdaClient = new LambdaClient({ region: AWS_REGIONS[sregion] });
        variables.SCHEDULED_FUNCTIONS.forEach(ufunctionId => {
            promises.push(invoke(
                client,
                `optFaas-dev-benchmarkRunner`,
                {
                    numberOfParallelExecutions: variables.NUMBER_OF_PARALLELIZATION,
                    language: "nodejs",
                    sregion: sregion,
                    ufunctionId: ufunctionId,
                }));

            promises.push(invoke(
                new LambdaClient({ region: 'us-east-1' }),
                'optFaas-dev-cwLogger',
                {
                    logGroupName: `/aws/lambda/optFaas-dev-benchmarkFunction${ufunctionId}`
                }));
        });
    });
    const response = await Promise.all(promises)
    return {
        statusCode: 200,
        body: 'Lambda executed successfully',
        response,
    };
}

export const main = scheduleBenchmarkFunctions;
