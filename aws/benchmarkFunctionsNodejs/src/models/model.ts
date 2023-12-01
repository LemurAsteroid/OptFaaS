export interface FunctionData {
    ufunctionId: number;
    language: string;
    description: string;
    // availableRegions: [Region];
}

export interface ExecutionData {
    requestId: string;
    functionName: string;
    memoryLimitInMB: string;
    sregion: string;
    language: string;
    numberOfParallelExecutions: number;
    [key: string]: string| number | boolean;
}

export interface ExecutionLog {
    functionId: string;
    executionId: number;
    language: string;
    region: string;
    status: boolean;
    response: string;
    latency: number;
    internalTime: number;
    numberOfExecutions: number;
    [key: string]: string | number | boolean;
}

export interface ExecutionLogComplete {
    functionId: string;
    executionId: number;
    language: string;
    region: string;
    sregion: string;
    status: boolean;
    response: string;
    latency: number;
    internalTime: number;
    numberOfExecutions: number;
    startupTime: number;
    coldStart: boolean;
    procTime: number;
    BilledTime: number;
    memorySize: number;
    maxMemoryUsed: number;
    [key: string]: string | number | boolean;
}

export interface s_log {
    u_function_id: string;
    number_of_concrurent_execution: number;
    region: number;
    language: string;
}

export interface ex_log {
    startupTime: number;
    coldStart: boolean;
    procTime: number;
    BilledTime: number;
    memorySize: number;
    maxMemoryUsed: number;
    [key: string]: string | number | boolean;
}


export interface BenchmarkFunction {
    (): boolean;
}
