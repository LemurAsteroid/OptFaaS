import { resolveURL } from '@libs/apiGatewayResolver';
import { middify } from '@libs/logger';
import fetch from 'node-fetch';
import variables, {GCP_REGIONS} from "../../../../variables";

const benchmarkRunnerAPI = async (event) => {
    const promises = []
    console.log(event)
    const payload = event.payload;

    const apiGatewayEndpoint = resolveURL(payload.sregion, payload.ufunctionId);
    console.log(apiGatewayEndpoint);
    const requestData = {
        ufunctionId: payload.ufunctionId,
        region: GCP_REGIONS[payload.sregion],
        numberOfParallelExecutions: payload.numberOfParallelExecutions,
    };

    for (let i = 0; i < payload.numberOfParallelExecutions; i++) {
        // Make an HTTP POST request to the API Gateway endpoint
        promises.push(fetch(apiGatewayEndpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestData),
        }));

    }
    const results = await Promise.allSettled(promises);

    await fetch(variables.GCF_LOG_FUNCTION_URL,{
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData),
    })

    // Process results here
    for (let result of results) {
        if (result.status === 'fulfilled') {
            let response = result.value;
            // Check if the response was successful
            if (response.ok) {
                const data = await response.json();
                console.log(data);
                result = data;
            } else {
                console.error(`Request failed with status ${response.status}`);
            }
        } else {
            const error = result.reason;
            console.error(`Error: ${error.message}`);
        }
    }
    
    return {
        statusCode: 200,
        body: results,
    };

};

export const main = middify(benchmarkRunnerAPI, "optFaas-dev-benchmarkRunnerAPI");
