import { DynamoDBClient, ScanCommand, UpdateItemCommand } from "@aws-sdk/client-dynamodb";
import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { unmarshall } from "@aws-sdk/util-dynamodb";


export async function updateSpace(event: APIGatewayProxyEvent, dynamodbClient: DynamoDBClient): Promise<APIGatewayProxyResult> {
    

    if(event.queryStringParameters && ('id' in event.queryStringParameters) && event.body) {
        
        const parseBody = JSON.parse(event.body || '{}')
        const spaceId = event.queryStringParameters['id'];
        const requestBodyKey = Object.keys(parseBody)[0];
        const requestBodyValue = parseBody[requestBodyKey];

        const updateResult = await dynamodbClient.send(new UpdateItemCommand({
            TableName: process.env.TABLE_NAME,
            Key: {
                'id': { S: spaceId }
            },
            UpdateExpression: `set #zzzNew = :new`,
            ExpressionAttributeValues: {
                ':new': { S: requestBodyValue }
            },
            ExpressionAttributeNames: {
                '#zzzNew': requestBodyKey
            },
            ReturnValues: 'UPDATED_NEW'
        }));

        return {
            statusCode: 204,
            body: JSON.stringify(updateResult.Attributes)
        }

    } return {
        statusCode: 400,
        body: JSON.stringify('Please provide an id and a body')
    }
}