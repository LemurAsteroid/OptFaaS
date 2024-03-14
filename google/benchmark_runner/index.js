const { CloudFunctionsServiceClient } = require('@google-cloud/functions');

exports.benchmarkRunner = async (req, res) => {

    res.set("Content-Type", "application/json");
	res.status(200);
    res.send(JSON.stringify({
        success: true,
        payload: {
            "test": "filesystem test",
            "status": "started test"
        }
    }));

    const data = req.body;
    const promises = [];
    console.log(data);

    const client = new CloudFunctionsServiceClient();

    for (let i = 0; i < data.numberOfExecution; i++) {
        const request = {
            name: `projects/optfaas/locations/${data.region}/functions/${data.language}${data.ufunctionId}`,
            data: {
                ufunctionId: data.ufunctionId,
                language: 'nodejs',
                region: data.sregion,
            },
        };

        // Invoke the Google Cloud Function asynchronously
        promises.push(client.callFunction(request));
    }

    const responses = await Promise.all(promises);

    console.log(`${data.numberOfExecution} functions succefully executed!`);
    console.log(responses);

    return {
        statusCode: 200,
        body: 'Function executions triggered successfully',
        responses: responses,
    };
};
