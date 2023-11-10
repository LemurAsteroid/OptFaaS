import { logExecutionData, middify } from "@libs/logger";

const matrixMultiplication = async (event, context, callback) => {

  let n;

  if(event.queryStringParameters && event.queryStringParameters.n) {
      n = event.queryStringParameters.n;
  } else {
      n = 100;
  }

  matrix(n);

  const res = {
    statusCode: 200,
    headers: {
       'Content-Type': 'application/json'
    },
    body: JSON.stringify({
        success: true,
        payload: {
            'test': 'matrix test',
            'n': Number(n),
            
        }
    })
  };
  logExecutionData(event, context);
  return res
};

export const main = middify(matrixMultiplication, "nodejs01")

const randomTable = (size) => Array.from(
  {length: size}, 
  () => Array.from({length: size}, () => Math.floor(Math.random() * 100))
)

function matrix(n: number) {
  
  const matrixA = randomTable(n);
  const matrixB = randomTable(n);
  

  const matrixMult: any[] = [];
  
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
