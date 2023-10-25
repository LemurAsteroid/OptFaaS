function createJsonFromString(inputString){
    // Remove all whitespace and single quotes from the input string
    // const cleanedString = inputString.replace(/'|\s+/g, '').replace('{', '').replace('}', '');
    const cleanedString = inputString.replace(/'|\s+|{|}|\"/g, '')
    const unquotedString = cleanedString.replace(/"/g, '');

    // Split the cleaned string into an array of key-value pairs
    const keyValuePairs = cleanedString.split(',');
    
  
    // Initialize an empty object to store the JSON
    const jsonObject= {};
  
    // Process each key-value pair and add them to the JSON object
    for (const pair of keyValuePairs) {
      const [key, value] = pair.split(':');
      jsonObject[key] = value;
    }
  
    return jsonObject;
  }
  
  const inputString = `{ requestId: "8fae757f-53de-425d-b655-5925b620f98d", logGroupName: "/aws/lambda/optFaas-dev-benchmarkFunction02", logStreamName: "2023/10/16/[$LATEST]9335d4fdd7454ab7835f8fca53b0466c", functionName: "optFaas-dev-benchmarkFunction02", memoryLimitInMB: "256", language: "nodejs", sregion: "us-east-1" }`;
  
  const jsonObject = createJsonFromString(inputString);
  
  console.log(jsonObject);