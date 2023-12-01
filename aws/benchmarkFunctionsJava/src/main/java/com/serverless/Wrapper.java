package com.serverless;

import com.amazonaws.services.lambda.runtime.Context;
import com.amazonaws.services.lambda.runtime.RequestHandler;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;

import java.util.Collections;
import java.util.Map;

public abstract class Wrapper implements RequestHandler<Map<String, Object>, ApiGatewayResponse> {

  protected static final Logger LOG = LogManager.getLogger(Wrapper.class);

  protected ExecutionDataLogger executionDataLogger = new ExecutionDataLogger();

  abstract void benchmarkFunction() throws Exception;

  @Override
  public ApiGatewayResponse handleRequest(Map<String, Object> input, Context context) {
    executionDataLogger.logExecutionData(input, context);

    try {
      benchmarkFunction();
    } catch (Exception e) {
      LOG.info("Error processing image: " + e.getMessage());
      Response responseBody = new Response("Error on", input);
      return ApiGatewayResponse.builder()
              .setStatusCode(500)
              .setObjectBody(responseBody)
              .setHeaders(Collections.singletonMap("X-Powered-By", "AWS Lambda & serverless"))
              .build();
    }

    Response responseBody = new Response("Go Serverless v1.x! Your function executed successfully!", input);
    return ApiGatewayResponse.builder()
            .setStatusCode(200)
            .setObjectBody(responseBody)
            .setHeaders(Collections.singletonMap("X-Powered-By", "AWS Lambda & serverless"))
            .build();
  }
}
