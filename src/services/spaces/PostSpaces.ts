import { DynamoDBClient, PutItemCommand } from "@aws-sdk/client-dynamodb";
import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { v4 } from "uuid";


export async function postSpaces(event: APIGatewayProxyEvent, dynamodbClient: DynamoDBClient): Promise<APIGatewayProxyResult> {
    const id = v4();
    const item = JSON.parse(event.body || '{}');
    item.id = id;

    const result = await dynamodbClient.send(new PutItemCommand({
        TableName: process.env.TABLE_NAME,
        Item: {
            id: { S: id },
            location: { S: item.location },
        }
    }))
    console.log('Result', result);
    return {
        statusCode: 201,
        body: JSON.stringify({id: id})
    }
}