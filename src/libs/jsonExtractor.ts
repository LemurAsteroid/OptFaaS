import { FilteredLogEvent } from "@aws-sdk/client-cloudwatch-logs";

const extractReportAttributes = (reportString: string): Record<string, string | number | boolean> | null => {
  const parts = reportString.replace(/'/g, "").split("	");
  const regexPattern = /(\d+)\s*(ms|MB)/;

  const jsonObject: Record<string, string | number | boolean> = {};

  parts.forEach(part => {
    const elements = part.split(': ');

    if (elements[0] != "\n") {
      const match = elements[1].match(regexPattern);
      jsonObject[elements[0].charAt(0).toLowerCase() + elements[0].slice(1).replace(/\s+/g, "")] = match ? parseInt(match[1], 10) : elements[1];
    }
  });



  return jsonObject;
}


const extractFunctionAttributes = (reportString: string): Record<string, string | number | boolean> | null => {
  const logParts = reportString.split('\t');
  const regexPattern = /(\d+)\s*(ms|MB)/;

  if (logParts.length >= 4) {
    const keyValuePairs = logParts[3].replace(/'|\s+|{|}|\"/g, '').split(',');

    const jsonObject: Record<string, string | number | boolean> = {
      timestamp: logParts[0]
    };

    for (const pair of keyValuePairs) {
      const [key, value] = pair.split(':');
      const match = value.match(regexPattern);
      if (match) {
        jsonObject[key] = parseInt(match[1], 10);
      } else {
        jsonObject[key] = value;
      }
    }

    return jsonObject;
  } else {
    console.error('Invalid log entry:', reportString);
    return null;
  };
}


const extractExecutionAttributes = (reportString: string): Record<string, string | number | boolean> | null => {
  const jsonLog: Record<string, string> = JSON.parse(reportString)

  return {
    requestId: jsonLog.function_request_id,
    coldStart: jsonLog.cold_start,
    functionName: jsonLog.function_name
  }
}


export const extractJsonFromLogEvent = (logEvent: FilteredLogEvent): Record<string, string | number | boolean> | null => {
  const logMessage = logEvent.message
  if (logMessage.startsWith('REPORT')) {
    return extractReportAttributes(logMessage.split('REPORT ')[1]);
  } else if (logMessage.includes('functionName')) {
    return extractFunctionAttributes(logMessage);
  } else if (logMessage.includes('function_name')) {
    return extractExecutionAttributes(logMessage);
  }
  return null;
};