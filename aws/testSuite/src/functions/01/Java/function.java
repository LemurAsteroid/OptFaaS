import java.io.BufferedReader;
import java.io.FileReader;
import java.io.IOException;
import java.util.Arrays;
import java.util.Random;

public class MatrixFunction {

    public static void main(String[] args) {
        int n = 100; // Default value of n

        // Read the value of n from command line arguments if provided
        if (args.length > 0) {
            n = Integer.parseInt(args[0]);
        }

        long startTime = System.nanoTime();
        int[][] result = matrix(n);
        long endTime = System.nanoTime();

        // Calculate elapsed time in milliseconds
        double elapsedTime = (endTime - startTime) / 1_000_000.0;

        // Print the result matrix
        for (int[] row : result) {
            System.out.println(Arrays.toString(row));
        }

        System.out.println("Elapsed Time (ms): " + elapsedTime);
    }

    public static int[][] matrix(int n) {
        int[][] matrixA = randomTable(n);
        int[][] matrixB = randomTable(n);
        int[][] matrixMult = new int[n][n];

        for (int i = 0; i < n; i++) {
            for (int j = 0; j < n; j++) {
                int sum = 0;
                for (int k = 0; k < n; k++) {
                    sum += matrixA[i][k] * matrixB[k][j];
                }
                matrixMult[i][j] = sum;
            }
        }

        return matrixMult;
    }

    public static int[][] randomTable(int size) {
        Random random = new Random();
        int[][] table = new int[size][size];

        for (int i = 0; i < size; i++) {
            for (int j = 0; j < size; j++) {
                table[i][j] = random.nextInt(100);
            }
        }

        return table;
    }
}
