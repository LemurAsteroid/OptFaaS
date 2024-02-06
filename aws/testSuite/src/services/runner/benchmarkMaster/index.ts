import { handlerPath } from '@libs/handler-resolver';
export default {
    handler: `${handlerPath(__dirname)}/handler.main`,
    memorySize: 256,
    timeout: 30,
    // events: [{ schedule: "rate(2 minutes)" }]
};
