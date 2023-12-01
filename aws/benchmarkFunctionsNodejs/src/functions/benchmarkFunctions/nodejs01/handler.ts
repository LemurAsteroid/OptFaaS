import {middify} from "@libs/logger";
import {BenchmarkFunction} from "@models/model";
import {wrapperFunction} from "@libs/wrapper";

const matrixMultiplication:BenchmarkFunction = () => {
    const n = 100;
    matrix(n);

    return true;
};

const randomTable = (size) =>
    Array.from({ length: size }, () =>
        Array.from({ length: size }, () => Math.floor(Math.random() * 100))
    );

function matrix(n) {
    const matrixA = randomTable(n);
    const matrixB = randomTable(n);

    const matrixMult = [];

    for (let i = 0; i < matrixA.length; i++) {
        matrixMult[i] = [];
        for (let j = 0; j < matrixB.length; j++) {
            let sum = 0;
            for (let k = 0; k < matrixA.length; k++) {
                sum += matrixA[i][k] * matrixB[k][j];
            }
            matrixMult[i][j] = sum;
        }
    }

    return true;
}

const wNodejs = async (event, context) => {
    return await wrapperFunction(matrixMultiplication, event, context);
}

export const main = middify(wNodejs, "nodejs01");
