package com.serverless;

import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.GetObjectRequest;

import javax.imageio.ImageIO;
import java.awt.image.BufferedImage;
import java.io.ByteArrayInputStream;


public class ImageProcessingFunction extends Wrapper {
  private static final String BUCKET_NAME = "optfaas-resource-bucket";
  private static final String OBJECT_KEY = "benchmark_image.jpg";

  @Override
  void benchmarkFunction() throws Exception {
    LOG.info("Processing image: s3://" + BUCKET_NAME + "/" + OBJECT_KEY);

    S3Client s3 = S3Client.create();
    byte[] imageBytes = s3.getObjectAsBytes(GetObjectRequest.builder().bucket(BUCKET_NAME).key(OBJECT_KEY).build()).asByteArray();

    BufferedImage image = ImageIO.read(new ByteArrayInputStream(imageBytes));

    // Perform image processing computation: Average Color Intensity
    double totalIntensity = 0;
    int width = image.getWidth();
    int height = image.getHeight();
    int numPixels = width * height;

    for (int y = 0; y < height; y++) {
      for (int x = 0; x < width; x++) {
        int rgb = image.getRGB(x, y);
        int red = (rgb >> 16) & 0xFF;
        int green = (rgb >> 8) & 0xFF;
        int blue = rgb & 0xFF;

        // Calculate the grayscale intensity (average of red, green, and blue)
        double intensity = (red + green + blue) / 3.0;
        totalIntensity += intensity;
      }
    }

    double averageIntensity = totalIntensity / numPixels;

    LOG.info("Image dimensions: " + width + "x" + height);
    LOG.info("Number of pixels: " + numPixels);
    LOG.info("Average Color Intensity: " + averageIntensity);
  }
}

