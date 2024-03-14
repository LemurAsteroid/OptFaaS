package com.serverless;

import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.DeleteObjectRequest;
import software.amazon.awssdk.services.s3.model.PutObjectRequest;

import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.UUID;

public class StorageBenchmark extends Wrapper {

  private static final String BUCKET_NAME = "optfaas-resource-bucket"; // Replace with your actual bucket name
  private static final int NUM_FILES = 7;
  private static List<String> fileNames = new ArrayList<>();

  @Override
  void benchmarkFunction() {
    createFiles();

    deleteFiles();
  }

  private static void createFiles() {
    S3Client s3 = S3Client.create();

    for (int i = 0; i < NUM_FILES; i++) {
      String fileName = generateUniqueFileName();
      fileNames.add(fileName);

      PutObjectRequest putObjectRequest = PutObjectRequest.builder()
              .bucket(BUCKET_NAME)
              .key(fileName)
              .build();

      // Create an empty file in S3
      s3.putObject(putObjectRequest, software.amazon.awssdk.core.sync.RequestBody.fromBytes(new byte[0]));
    }
  }

  private static void deleteFiles() {
    S3Client s3 = S3Client.create();

    for (String fileName : fileNames) {
      DeleteObjectRequest deleteObjectRequest = DeleteObjectRequest.builder()
              .bucket(BUCKET_NAME)
              .key(fileName)
              .build();

      // Delete the file from S3
      s3.deleteObject(deleteObjectRequest);
    }
  }


  private static String generateUniqueFileName() {
    // Use a combination of timestamp and UUID to create a unique file name
    SimpleDateFormat dateFormat = new SimpleDateFormat("yyyyMMddHHmmssSSS");
    String timestamp = dateFormat.format(new Date());
    String randomUUID = UUID.randomUUID().toString().replace("-", "");

    return "file_" + timestamp + "_" + randomUUID + ".txt";
  }
}
