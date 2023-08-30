import { putFunctionValue } from "@libs/dynamoDB";
import { functionData } from "@models/models"

const runner = async (event, context, callback) => {

    const testFunctionData = new functionData(1,"Java","ass")
    putFunctionValue(testFunctionData)


    /* const returnValues = event.function();

    console.log("Return values:", returnValues);

    return {
        statusCode: 200,
        body: JSON.stringify(
            {
                success: true,
                initTime: returnValues.initTime,
                procTime: returnValues.procTime,
                functionId: event.function.functionId,
                executionId: event.executionId,
            }
        )
    } */
};

export const main = runner;

