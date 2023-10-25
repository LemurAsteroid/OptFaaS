import { LambdaClient, InvokeCommand, InvokeCommandInput } from "@aws-sdk/client-lambda";
import { AWS_REGIONS } from 'variables';

export const invoke = async (sregion: string, ufunctionId: string, payload: any) => {
    const client: LambdaClient = new LambdaClient({ region: AWS_REGIONS[sregion] });

    const params: InvokeCommandInput = {
        FunctionName: ufunctionId,
        InvocationType: 'Event',
        Payload: JSON.stringify({
            payload
        })
    };
    return client.send(new InvokeCommand(params))
}