export interface ExecutionData {
    requestId: string;
    logGroupName: string;
    logStreamName: string;
    functionName: string;
    memoryLimitInMB: string;
    sregion: string;
    language: string;
    numberOfParallelExecutions: number;
    [key: string]: string| number | boolean;
}
