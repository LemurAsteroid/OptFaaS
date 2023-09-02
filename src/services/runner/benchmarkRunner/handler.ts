import { LambdaClient, InvokeCommand, InvokeCommandInput } from "@aws-sdk/client-lambda";

const benchmarkRunner = async (event) => {
    const promises = []
    console.log(event)
    
    const client: LambdaClient = new LambdaClient({region: event.sregion});
    
    for (let i = 0; i < event.numberOfExecution; i++) {
        const params: InvokeCommandInput = {
            FunctionName: `optFaas-dev-benchmarkFunction${event.ufunctionId}`,
            InvocationType: 'Event',
            Payload: JSON.stringify({ 
                ufunctionId: event.ufunctionId,
                language: "Nodejs",
                region: event.sregion,
            }) // Payload to pass to the target Lambda
        };
        promises.push(client.send(new InvokeCommand(params)))
    }

    const response = await Promise.all(promises)
    return {
        statusCode: 200,
        body: 'Lambda executed successfully',
        response: response,
    };


    /* const result: ExecutionLog = {
        "functionId": event.executionData.functionId,
        "executionId": event.executionData.executionId,
        "language": event.executionData.language,
        "region": event.executionData.region,
        "latency": 0,
        "status": status,
        "response": response,
        "internalTime": endTime-startTime
        }
    if (status) {
        putValue('ExecutionLogTable', result);
    } else {
        // Err
    } */
    
};

export const main = benchmarkRunner;
