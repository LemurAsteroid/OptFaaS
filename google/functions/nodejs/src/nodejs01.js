matrixMultiplication = async (req, res) => {
    const n = 100;
    matrix(n);

  return {success: true,
      payload: {
          "test": "cpu test",
          "n": Number(n)
      }};
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

module.exports = {
    matrixMultiplication
}
