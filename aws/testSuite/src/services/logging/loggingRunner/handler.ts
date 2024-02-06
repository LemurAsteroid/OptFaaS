import { LambdaClient } from "@aws-sdk/client-lambda";
import { invoke } from "@libs/invoker";
import { middify } from "@libs/logger";
import {variables} from "variables";
import * as console from "console";
const logging = async () => {
    const promises = []
    const client: LambdaClient = new LambdaClient({region: 'us-east-1'});
    variables.REGION.forEach(sregion => {
        variables.SCHEDULED_FUNCTIONS.forEach(ufunctionId => {
            const payload = {
                sregion: sregion,
                ufunctionId: ufunctionId,
            }
            promises.push(invoke(
                client,
                'optFaas-dev-cloudWatchLogger',
                payload));

            console.log(`Started Logger for ${ufunctionId} in ${sregion}`);

            // promises.push(invokeGcfLogger(sregion, ufunctionId));
        });
    });
    await Promise.all(promises)
    return {
        statusCode: 200,
        body: 'All Runners were started successfully'
    };
};

export const main = middify(logging, "optFaas-dev-loggingRunner");
