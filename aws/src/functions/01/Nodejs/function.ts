import { now } from 'performance-now'
import { fs } from 'fs'


const matrixMultiplication = async (event, context, callback) => {

  let cpuinfo = fs.readFileSync('/proc/cpuinfo', 'utf8');
  let instanceId = fs.readFileSync('/proc/self/cgroup', 'utf-8');
  let meminfo = fs.readFileSync('/proc/meminfo', 'utf8');
  let uptime = fs.readFileSync('/proc/uptime', 'utf-8');

  let n;

  if(event.queryStringParameters && event.queryStringParameters.n) {
      n = event.queryStringParameters.n;
  } else {
      n = 100;
  }

  let [initTime, procTime, result] = matrix(n);

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
            'initTime': Number((initTime).toFixed(3)),
            'procTime': Number((procTime).toFixed(3))
            
        },
        metrics: {
            machineid: '',
            instanceid: instanceId,
            cpu: cpuinfo,
            mem: meminfo,
            uptime: uptime
        }
    })
  };
  callback(null, res);
};

const randomTable = (size) => Array.from(
  {length: size}, 
  () => Array.from({length: size}, () => Math.floor(Math.random() * 100))
)

function matrix(n: number): [number, number, any] {
  let startInit = now();
  const matrixA = randomTable(n);
  const matrixB = randomTable(n);
  let endInit = now();

  const matrixMult: any[] = [];
  let startProc = now();
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
  let endProc = now();

  return [(endInit - startInit), (endProc - startProc), matrixMult];
}

export const main = matrixMultiplication
