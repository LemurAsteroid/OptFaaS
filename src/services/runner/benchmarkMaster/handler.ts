import { LambdaClient, InvokeCommand, InvokeCommandInput } from "@aws-sdk/client-lambda";
import { variables, AWS_REGIONS } from 'variables';

const scheduleBenchmarkFunctions = async (event) => {
    const promises = []

    variables.REGION.forEach(sregion => {
        const client: LambdaClient = new LambdaClient({ region: AWS_REGIONS[sregion] });
        variables.SCHEDULED_FUNCTIONS.forEach(ufunctionId => {
            const params: InvokeCommandInput = {
                FunctionName: `optFaas-dev-benchmarkRunnerAPI`,
                InvocationType: 'Event',
                Payload: JSON.stringify({
                    "functionData": {
                        "ufunctionId": ufunctionId,
                        "language": "nodejs",
                    },
                    "sregion": sregion,
                    "provider": "GCF",
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
