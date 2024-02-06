import { Logger, injectLambdaContext } from '@aws-lambda-powertools/logger';
import { Metrics, logMetrics } from '@aws-lambda-powertools/metrics';
import middy from '@middy/core';


const defaultValues = {
    region: process.env.AWS_REGION || 'N/A',
    executionEnv: process.env.AWS_EXECUTION_ENV || 'N/A',
};

const metrics = new Metrics({
    defaultDimensions: defaultValues,
});

export const middify = (handler: any, serviceName: string) => {
    const logger = new Logger({
        logLevel: 'INFO',
        serviceName: serviceName,
    });
    return middy(handler)
        .use(logMetrics(metrics))
        .use(injectLambdaContext(logger, { logEvent: true }));
}
