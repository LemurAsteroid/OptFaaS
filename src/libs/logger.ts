import { Logger, injectLambdaContext } from '@aws-lambda-powertools/logger';
import { Metrics, logMetrics } from '@aws-lambda-powertools/metrics';
import middy from '@middy/core';
import { ExecutionData } from '@models/model';
import { invoke } from './invoker';

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


export const safeExecutionData = async (event, context) => {
    const executionData: ExecutionData = {
        "requestId": context.awsRequestId,
        "logGroupName": context.logGroupName,
        "logStreamName": context.logStreamName,
        "functionName": context.functionName,
        "memoryLimitInMB": context.memoryLimitInMB,
        "language": event.language,
        "sregion": event.sregion
    }

    await invoke('us-east-1', 'optFaas-dev-logger', executionData)
}

export const logExecutionData = (event, context) => {
    const executionData: ExecutionData = {
        "requestId": context.awsRequestId,
        "logGroupName": context.logGroupName,
        "logStreamName": context.logStreamName,
        "functionName": context.functionName,
        "memoryLimitInMB": context.memoryLimitInMB,
        "language": event.language,
        "sregion": event.sregion,
        "numberOfParallelExecutions": event.numberOfParallelExecutions
    }

    console.log(executionData)
}