package functions;

import com.google.cloud.functions.HttpFunction;
import com.google.cloud.functions.HttpRequest;
import com.google.cloud.functions.HttpResponse;
import com.google.cloud.storage.Blob;
import com.google.cloud.storage.Storage;
import com.google.cloud.storage.StorageOptions;

import javax.imageio.ImageIO;
import java.awt.image.BufferedImage;
import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.util.logging.Logger;


public class ImageProcessingFunction implements HttpFunction {
    private static final String BUCKET_NAME = "image_benchmark_bucket";
    private static final String OBJECT_NAME = "benchmark_image.jpg";

    private static final Logger logger = Logger.getLogger(ImageProcessingFunction.class.getName());

    @Override
    public void service(HttpRequest request, HttpResponse response) throws Exception {
        logger.info("Processing image: gs://" + BUCKET_NAME + "/" + OBJECT_NAME);

        try {
            Storage storage = StorageOptions.getDefaultInstance().getService();

            // Download the image from Cloud Storage
            Blob blob = storage.get(BUCKET_NAME, OBJECT_NAME);
            byte[] imageBytes = blob.getContent();

            // Convert the byte array to a BufferedImage
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

            // Calculate the average color intensity
            double averageIntensity = totalIntensity / numPixels;

            logger.info("Image dimensions: " + width + "x" + height);
            logger.info("Number of pixels: " + numPixels);
            logger.info("Average Color Intensity: " + averageIntensity);

            // Additional image processing logic can be added here

        } catch (IOException e) {
            logger.severe("Error processing image: " + e.getMessage());
        }
    }
}
