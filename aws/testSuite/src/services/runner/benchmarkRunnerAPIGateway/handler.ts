import { resolveURL } from '@libs/apiGatewayResolver';
import { middify } from '@libs/logger';
import fetch from 'node-fetch';

const benchmarkRunnerAPI = async (event) => {
    const promises = []
    console.log(event)

    const apiGatewayEndpoint = resolveURL(event.sregion, event.provider, event.functionData); // Replace with your API Gateway endpoint URL
    console.log(apiGatewayEndpoint);

    for (let i = 0; i < event.numberOfExecution; i++) {
        const requestData = {
            ufunctionId: event.functionData.ufunctionId,
            region: event.sregion,
            numberOfParallelExecutions: event.numberOfExecution,
        };

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
