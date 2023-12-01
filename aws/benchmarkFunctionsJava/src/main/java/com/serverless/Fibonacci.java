package com.serverless;


public class Fibonacci extends Wrapper {
  @Override
  void benchmarkFunction() throws Exception {
    calculateFibonacci(100);
  }

  public static long calculateFibonacci(int n) {
    if (n <= 1) {
      return n;
    }

    long[] fibArray = new long[n + 1];
    fibArray[0] = 0;
    fibArray[1] = 1;

    for (int i = 2; i <= n; i++) {
      fibArray[i] = fibArray[i - 1] + fibArray[i - 2];
    }

    return fibArray[n];
  }
}
