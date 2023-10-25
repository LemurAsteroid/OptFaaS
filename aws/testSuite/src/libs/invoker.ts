import { LambdaClient, InvokeCommand, InvokeCommandInput } from "@aws-sdk/client-lambda";
import { AWS_REGIONS } from 'variables';

/**
 * Asynchronously invokes an AWS Lambda function with the specified parameters.
 *
 * This function allows you to trigger the execution of an AWS Lambda function in a specific
 * AWS region with custom payload data. It sends an 'Event' type invocation to the specified
 * Lambda function and returns a Promise that resolves with the response from the invocation.
 *
 * @param client - The Lambda Client to deploy the function.
 * @param ufunctionId - The name or identifier of the Lambda function to be invoked.
 * @param payload - The custom data payload to pass as input to the Lambda function.
 * @returns A Promise that resolves to the response from invoking the Lambda function.
 */
export const invoke = async (client: LambdaClient, ufunctionId: string, payload: any) => {
    const params: InvokeCommandInput = {
        FunctionName: ufunctionId,
        InvocationType: 'Event',
        Payload: JSON.stringify({ payload })
    };
    return client.send(new InvokeCommand(params))
}