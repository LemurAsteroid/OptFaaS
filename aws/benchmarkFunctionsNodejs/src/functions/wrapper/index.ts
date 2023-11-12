import { handlerPath } from '@libs/handler-resolver';

export const nodejs01 = {
    handler: `${handlerPath(__dirname)}/handler.nodejs01`,
    memorySize: 256,
}
export const nodejs02 = {
    handler: `${handlerPath(__dirname)}/handler.nodejs02`,
    memorySize: 256,
}
