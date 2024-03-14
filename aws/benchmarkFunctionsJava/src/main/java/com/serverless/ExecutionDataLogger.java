package com.serverless;

import com.amazonaws.services.lambda.runtime.Context;
import com.fasterxml.jackson.core.JsonProcessingException;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.Map;

public class ExecutionDataLogger {

  protected static final Logger LOG = LogManager.getLogger(ExecutionDataLogger.class);

  public void logExecutionData(Map<String, Object> input, Context context) throws NullPointerException, JsonProcessingException {
    LOG.info(input);
    Map<String, Object> payload = (Map<String, Object>) input.get("payload");
    ExecutionData executionData = new ExecutionData(
            context.getAwsRequestId(),
            LocalDateTime.now(),
            context.getFunctionName(),
            context.getMemoryLimitInMB(),
            "java",
            payload.get("sregion").toString(),
            Integer.parseInt(payload.get("numberOfParallelExecutions").toString())
    );
    LOG.info(executionData.toString());
  }

  // Define the ExecutionData class with appropriate constructor and toString() method
  public static class ExecutionData {
    private String requestId;
    private LocalDateTime localDateTime;
    private String functionName;
    private int memoryLimitInMB;
    private String language;
    private String sregion;
    private int numberOfParallelExecutions;

    public ExecutionData(String requestId, LocalDateTime localDateTime, String functionName,
                         int memoryLimitInMB, String language, String sregion, int numberOfParallelExecutions) {
      this.requestId = requestId;
      this.functionName = functionName;
      this.localDateTime = localDateTime;
      this.memoryLimitInMB = memoryLimitInMB;
      this.language = language;
      this.sregion = sregion;
      this.numberOfParallelExecutions = numberOfParallelExecutions;
    }

    @Override
    public String toString() {
      return "{" +
              "requestId='" + requestId + '\'' +
              ", functionName='" + functionName + '\'' +
              ", timestamp='" + localDateTime.format(DateTimeFormatter.ISO_DATE_TIME) + '\'' +
              ", memoryLimitInMB=" + memoryLimitInMB + '\'' +
              ", language='" + language + '\'' +
              ", sregion='" + sregion + '\'' +
              ", numberOfParallelExecutions=" + numberOfParallelExecutions +
              '}';
    }
  }
}
