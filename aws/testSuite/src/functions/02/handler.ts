import { logExecutionData, middify } from "@libs/logger";

const benchmarkFunction02 = async (event, context) => {
  try {

    // Your function logic here

    await logExecutionData(event, context)

    return {
      statusCode: 200,
      body: {
        res: 'Lambda executed successfully',
        context: context,
      }
    };
  } catch (error) {
    console.error('Error:', error);
    return {
      statusCode: 500,
      body: 'An error occurred',
    };
  }
};


export const main = middify(benchmarkFunction02, "nodejs02")