import {FilteredLogEvent} from "@aws-sdk/client-cloudwatch-logs";

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
    if (jsonObject['initDuration'] == undefined) {
        jsonObject['initDuration'] = 0;
        jsonObject['coldStart'] = false;
    } else {
        jsonObject['coldStart'] = true;
    }
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

            jsonObject[key] = match ? parseInt(match[1], 10) : value;
        }
        return jsonObject;
    } else {
        console.error('Invalid log entry:', reportString);
        return null;
    }
}

const extractJavaFunctionAttributes = (reportString: string): Record<string, string | number | boolean> | null => {
    reportString = dropCharactersBeforeOpeningBrace(reportString);
    const keyValuePairs = reportString.replace(/'|\s+|{|}|\"/g, '').split(',');

    const jsonObject: Record<string, string | number | boolean> = {};

    for (const pair of keyValuePairs) {
        const [key, value] = pair.split('=');
        jsonObject[key] = value;
    }
    console.log(jsonObject);
    return jsonObject;
}


const extractExecutionAttributes = (reportString: string): Record<string, string | number | boolean> | null => {
    const jsonLog: Record<string, string> = JSON.parse(reportString)

    return {
        requestId: jsonLog.function_request_id,
        coldStart: jsonLog.cold_start,
        functionName: jsonLog.function_name
    }
}

function dropCharactersBeforeOpeningBrace(input: string): string {
    const indexOfOpeningBrace = input.indexOf('{');

    if (indexOfOpeningBrace !== -1) {
        return input.substring(indexOfOpeningBrace);
    } else {
        return input;
    }
}

export const extractJsonFromLogEvent = (logEvent: FilteredLogEvent): Record<string, string | number | boolean> | null => {
    const logMessage = logEvent.message
    if (logMessage.startsWith('REPORT')) {
        return extractReportAttributes(logMessage.split('REPORT ')[1]);
    } else if (logMessage.includes('nodejs')) {
        return extractFunctionAttributes(logMessage);
    } else if (logMessage.includes('function_name')) {
        return extractExecutionAttributes(logMessage);
    } else if (logMessage.includes('userCPUTime')) {
        return extractFunctionAttributes(logMessage);
    } else if (logMessage.includes('optFaas-java')) {
        return extractJavaFunctionAttributes(logMessage);
    }
    return null;
};


export const storeInMap = (input: Record<string, any>, map: Map<string, any>): void => {
    const {requestId, ...data} = input;

    if (!requestId) {
        console.error(input)
        throw new Error('Input must have a "requestId" property.');
    }

    if (map.has(requestId)) {
        const existingData = map.get(requestId) || {};
        map.set(requestId, {...existingData, ...data});
    } else {
        map.set(requestId, data);
    }
}

export const mapToCsv = (map: Record<string, any>): string => {
    let sortedInnerMap;
    const rows = Array.from(map.entries()).map(([key, value]) => {
        // Sort the properties of the inner map
        sortedInnerMap = Object.keys(value)
            .sort((a, b) => a.localeCompare(b))
            .reduce((obj, k) => {
                obj[k] = value[k];
                return obj;
            }, {});

        const values = Object.values(sortedInnerMap).map((v) => (v !== undefined ? v : 'undefined'));
        return `${key},${values.join(',')}`;
    });
    console.log(sortedInnerMap)
    const headers = Object.keys(sortedInnerMap).join(',');

    return `requestId, ${headers}\n${rows.join('\n')}`;
};
