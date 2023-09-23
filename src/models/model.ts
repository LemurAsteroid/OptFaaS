export interface FunctionData {
    ufunctionId: number;
    language: string;
    description: string;
    // availableRegions: [Region];
}

// export = FunctionData;


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

export interface ExecutionLogCW {
    startupTime: number;
    coldStart: boolean; 
    procTime: number;
    BilledTime: number;
    memorySize: number;
    maxMemoryUsed: number;
    [key: string]: string | number | boolean;
}

export interface Region {
    [regionId:string]: string;
}


export interface TestFunction {
    (): [boolean, string];
}