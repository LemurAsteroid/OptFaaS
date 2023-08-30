interface FunctionData {
    functionId: number;
    language: string;
    description: string;
    // availableRegions: [Region];
}

export default FunctionData

interface ExecutionLog {
    executionId: number;
    functionId: Function;
    region: Region;
    status: boolean;
    latency: number;
    initTime: number;
    procTime: number;
    BilledTime: number;
    memorySize: number;
    maxMemoryUsed: number;
}

interface Region {
    regionId: string;
}
