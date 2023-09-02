import { LambdaClient, InvokeCommand, InvokeCommandInput } from "@aws-sdk/client-lambda";
import variables from 'variables';

const scheduleBenchmarkFunctions = async (event) => {
    const promises = []

    variables.REGION.forEach(sregion => {
        const client: LambdaClient = new LambdaClient({region: sregion});
        variables.SCHEDULED_FUNCTIONS.forEach(uFunctionId => {
            const params: InvokeCommandInput = {
                FunctionName: `optFaas-dev-benchmarkRunner`,
                InvocationType: 'Event',
                Payload: JSON.stringify({
                    "ufunctionId": uFunctionId,
                    "language": "Nodejs",
                    "sregion": sregion,
                    "numberOfExecution": variables.NUMBER_OF_PARALLELIZATION,
                }) // Payload to pass to the target Lambda
            };
            promises.push(client.send(new InvokeCommand(params)))
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
