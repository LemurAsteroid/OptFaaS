const functions = require('@google-cloud/functions-framework');

functions.http('nodejs_fun01', (req, res) => {
  console.log("started");
  let n = 100;

  
  matrix(n);

  console.log("finished");

  const response = {
    statusCode: 200,
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      success: true,
      payload: {
        test: 'matrix test',
        n: Number(n),
      },
    }),
  };

  
  res.status(200).send(response);
});

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

