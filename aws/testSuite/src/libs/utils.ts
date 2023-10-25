import { randomInt } from 'node:crypto';

export const sleep = (ms: number): Promise<void> => {
    return new Promise((resolve) => setTimeout(resolve, ms));
};

export const avoidThrottling = async <T>(
    f: () => T,
    range = 50
): Promise<T> => {
    await sleep(randomInt(range));
    return await f();
};
