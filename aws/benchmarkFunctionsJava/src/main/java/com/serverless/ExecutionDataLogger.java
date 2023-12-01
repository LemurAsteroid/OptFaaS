package com.serverless;

import com.amazonaws.services.lambda.runtime.Context;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;

import java.util.Map;

public class ExecutionDataLogger {

  protected static final Logger LOG = LogManager.getLogger(ExecutionDataLogger.class);

  public void logExecutionData(Map<String, Object> input, Context context) {
    ExecutionData executionData = new ExecutionData(
            context.getAwsRequestId(),
            context.getLogGroupName(),
            context.getLogStreamName(),
            context.getFunctionName(),
            context.getMemoryLimitInMB(),
            input.get("language").toString(),
            input.get("sregion").toString(),
            Integer.parseInt(input.get("numberOfParallelExecutions").toString())
    );
    LOG.info(executionData.toString());
  }

  // Define the ExecutionData class with appropriate constructor and toString() method
  public static class ExecutionData {
    private String requestId;
    private String logGroupName;
    private String logStreamName;
    private String functionName;
    private int memoryLimitInMB;
    private String language;
    private String sregion;
    private int numberOfParallelExecutions;

    public ExecutionData(String requestId, String logGroupName, String logStreamName, String functionName,
                         int memoryLimitInMB, String language, String sregion, int numberOfParallelExecutions) {
      this.requestId = requestId;
      this.logGroupName = logGroupName;
      this.logStreamName = logStreamName;
      this.functionName = functionName;
      this.memoryLimitInMB = memoryLimitInMB;
      this.language = language;
      this.sregion = sregion;
      this.numberOfParallelExecutions = numberOfParallelExecutions;
    }

    @Override
    public String toString() {
      return "{" +
              "requestId='" + requestId + '\'' +
              ", logGroupName='" + logGroupName + '\'' +
              ", logStreamName='" + logStreamName + '\'' +
              ", functionName='" + functionName + '\'' +
              ", memoryLimitInMB=" + memoryLimitInMB +
              ", language='" + language + '\'' +
              ", sregion='" + sregion + '\'' +
              ", numberOfParallelExecutions=" + numberOfParallelExecutions +
              '}';
    }
  }
}
