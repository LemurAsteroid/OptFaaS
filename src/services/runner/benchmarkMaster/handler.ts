import { LambdaClient, InvokeCommand, InvokeCommandInput } from "@aws-sdk/client-lambda";
import { variables, AWS_REGIONS } from 'variables';

const scheduleBenchmarkFunctions = async (event) => {
    const promises = []

    variables.REGION.forEach(sregion => {
        const client: LambdaClient = new LambdaClient({ region: AWS_REGIONS[sregion] });
        variables.SCHEDULED_FUNCTIONS.forEach(ufunctionId => {
            const params: InvokeCommandInput = {
                FunctionName: `optFaas-dev-benchmarkRunner`,
                InvocationType: 'Event',
                Payload: JSON.stringify({
                    ufunctionId: ufunctionId,
                    language: "nodejs",
                    sregion: sregion,
                    provider: "GCP",
                    numberOfParallelExecutions: variables.NUMBER_OF_PARALLELIZATION,
                })
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
