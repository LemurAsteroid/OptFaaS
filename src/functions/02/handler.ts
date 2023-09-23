import { middify } from "@libs/logger";

const benchmarkFunction02 = async (event, context) => {
    try {
      console.log('Lambda function triggered by CloudWatch Events schedule');
      console.log(context);
  
      // Your function logic here
  
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