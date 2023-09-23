import { DynamoDBClient, PutItemCommand, GetItemCommand } from "@aws-sdk/client-dynamodb";
import { marshall, unmarshall } from "@aws-sdk/util-dynamodb"
import type { GetItemCommandInput, PutItemCommandInput } from "@aws-sdk/client-dynamodb";


type DBTables = 'FunctionTable' | 'ExecutionLogTable'
type QueryParams = { [key in string]: string | number | boolean }

const db = new DynamoDBClient({region: 'us-east-1'})

export const getValue = async <T>(table: DBTables, params: QueryParams): Promise<T | undefined> => {
    const input: GetItemCommandInput = {
        TableName: table,
        Key: marshall(params)

    };
    const command = new GetItemCommand(input)
    const response = await db.send(command)
    return unmarshall(response.Item) as T
}

export const putValue = async (table: DBTables, item: QueryParams) => {
    const input: PutItemCommandInput = {
        TableName: table,
        Item: marshall(item)

    };
    const command = new PutItemCommand(input)
    const response = await db.send(command)
    return response
}
