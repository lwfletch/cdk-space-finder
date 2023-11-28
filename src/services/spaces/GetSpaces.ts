import { DynamoDBClient, ScanCommand } from "@aws-sdk/client-dynamodb";
import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { v4 } from "uuid";


export async function getSpaces(event: APIGatewayProxyEvent, dynamodbClient: DynamoDBClient): Promise<APIGatewayProxyResult> {
    
    const result = await dynamodbClient.send(new ScanCommand({
        TableName: process.env.TABLE_NAME,
    }))
    console.log('Result Items', result.Items);
    return {
        statusCode: 201,
        body: JSON.stringify(result.Items)
    }
}