import { putValue } from "@libs/dynamoDB";
import type { ExecutionLog } from "@models/model";

const logger = async (event) => {
    if (event.results.status) {
        /* const log: ExecutionLog;
        
        putValue("ExecutionLogTable", log) */
    } else {
        //Err
    }
};

export const main = logger;
