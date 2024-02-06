import {LambdaClient} from "@aws-sdk/client-lambda";
import {invoke} from "@libs/invoker";
import {variables} from 'variables';
import * as console from "console";
import {randomInt} from "node:crypto";

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
const scheduleBenchmarkFunctions = async (): Promise<any> => {
    const numberOfParallelExecutions = variables.NUMBER_OF_PARALLELIZATION[randomInt(0, variables.NUMBER_OF_PARALLELIZATION.length)]
    const promises = []
    const client: LambdaClient = new LambdaClient({region: 'us-east-1'});
    variables.REGION.forEach(sregion => {
        variables.SCHEDULED_FUNCTIONS.forEach(ufunctionId => {
            const payload = {
                numberOfParallelExecutions: numberOfParallelExecutions,
                sregion: sregion,
                ufunctionId: ufunctionId,
            }
            promises.push(invoke(
                client,
                `optFaas-dev-benchmarkRunner`,
                payload
            ));
            /*promises.push(invoke(
                client,
                `optFaas-dev-benchmarkRunnerAPI`,
                {
                    numberOfParallelExecutions: numberOfParallelExecutions,
                    sregion: sregion,
                    ufunctionId: ufunctionId,
                }));*/
            console.log(`Started Runner for ${ufunctionId} in ${sregion} with ${numberOfParallelExecutions} executions`);
        });
    });

    await Promise.all(promises)
    return {
        statusCode: 200,
        body: 'All Runners were started successfully'
    };
}

export const main = scheduleBenchmarkFunctions;
