import { handlerPath } from '@libs/handler-resolver';
export default {
    handler: `${handlerPath(__dirname)}/handler.main`,
    memorySize: 256,
    // events: [ { schedule: "rate(1 minute)" } ]
};