import { handlerPath } from '@libs/handler-resolver';
// import { Duration } from 'aws-cdk-lib';
export default {
    handler: `${handlerPath(__dirname)}/handler.main`,
    timeout: 30,
    memorySize: 256,
};