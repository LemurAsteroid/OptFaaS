package functions;

import com.google.cloud.functions.HttpFunction;
import com.google.cloud.functions.HttpRequest;
import com.google.cloud.functions.HttpResponse;
import com.google.cloud.storage.BlobId;
import com.google.cloud.storage.BlobInfo;
import com.google.cloud.storage.Storage;
import com.google.cloud.storage.StorageOptions;

import java.io.BufferedWriter;
import java.io.IOException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.concurrent.TimeUnit;
import java.util.UUID;

public class GCFStorageBenchmark implements HttpFunction {

    private static final String BUCKET_NAME = "storage_benchmark"; // Replace with your actual bucket name
    private static final int NUM_FILES = 7;
    private List<String> fileNames = new ArrayList<>();

    @Override
    public void service(HttpRequest request, HttpResponse response) throws IOException {
        long startTime = System.nanoTime();

        try {
            // Create files in Cloud Storage
            createFiles();

            // Perform other benchmark tasks if needed

            // Delete files in Cloud Storage
            deleteFiles();

            long endTime = System.nanoTime();
            long elapsedTime = TimeUnit.NANOSECONDS.toMicros(endTime - startTime);

            // Respond with benchmark results
            BufferedWriter writer = response.getWriter();
            writer.write("GCF Storage Benchmark took: " + elapsedTime + " microseconds");
        } catch (Exception e) {
            // Handle exceptions appropriately
            response.setStatusCode(500);
            response.getWriter().write("Error: " + e.getMessage());
        }
    }

    private void createFiles() {
        Storage storage = StorageOptions.getDefaultInstance().getService();
        for (int i = 0; i < NUM_FILES; i++) {
            // Generate a unique file name using timestamp and UUID
            String fileName = generateUniqueFileName();
            fileNames.add(fileName);

            // Create a BlobId to represent the file
            BlobId blobId = BlobId.of(BUCKET_NAME, fileName);

            // Create a BlobInfo with the BlobId
            BlobInfo blobInfo = BlobInfo.newBuilder(blobId).build();

            // Create an empty file in Cloud Storage
            storage.create(blobInfo, new byte[0]);
        }
    }

    private void deleteFiles() {
        Storage storage = StorageOptions.getDefaultInstance().getService();
        fileNames.forEach(fileName -> storage.delete(BlobId.of(BUCKET_NAME, fileName)));
    }


    private String generateUniqueFileName() {
        // Use a combination of timestamp and UUID to create a unique file name
        SimpleDateFormat dateFormat = new SimpleDateFormat("yyyyMMddHHmmssSSS");
        String timestamp = dateFormat.format(new Date());
        String randomUUID = UUID.randomUUID().toString().replace("-", "");

        return "file_" + timestamp + "_" + randomUUID + ".txt";
    }
}
