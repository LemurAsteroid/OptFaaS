import { DynamoDBClient, PutItemCommand, GetItemCommand, UpdateItemCommand } from "@aws-sdk/client-dynamodb";
import { marshall, unmarshall } from "@aws-sdk/util-dynamodb"
import type { GetItemCommandInput, PutItemCommandInput, UpdateItemCommandInput } from "@aws-sdk/client-dynamodb";


type DBTables = 'FunctionTable' | 'ExecutionLogTable'
type QueryParams = { [key in string]: string | number | boolean }

const db = new DynamoDBClient({ region: 'us-east-1' })

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


/**
 * Function to store a JSON object in DynamoDB using the update method.
 * @param tableName - The name of the DynamoDB table.
 * @param key - The primary key for the item.
 * @param item - An object with the updates you want to apply.
 */
export const updateValue = async (tableName: DBTables, key: QueryParams, item: QueryParams) => {
    delete item['requestId'];
    const input: UpdateItemCommandInput = {
        TableName: tableName,
        Key: marshall(key),
        ExpressionAttributeNames: Object.keys(item).reduce(
            (acc, key) => ({
                ...acc,
                [`#${key}`]: key,
            }),
            {}
        ),
        ExpressionAttributeValues: marshall(Object.keys(item).reduce(
            (acc, key) => ({
                ...acc,
                [`:${key}`]: item[key],
            }),
            {}
        )),
        UpdateExpression: 'SET ' + Object.keys(item).map((key) => `#${key} = :${key}`).join(', '),
        ReturnValues: "UPDATED_NEW",
    };
    const command = new UpdateItemCommand(input)
    console.log(command)
    const response = await db.send(command)
    return response
}
