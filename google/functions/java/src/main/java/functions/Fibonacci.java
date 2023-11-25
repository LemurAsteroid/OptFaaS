package functions;

import com.google.cloud.functions.HttpFunction;
import com.google.cloud.functions.HttpRequest;
import com.google.cloud.functions.HttpResponse;

import java.io.IOException;

public class Fibonacci implements HttpFunction {
    @Override
    public void service(HttpRequest request, HttpResponse response) throws IOException {
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
