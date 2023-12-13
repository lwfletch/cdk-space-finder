import { DynamoDBClient, DeleteItemCommand } from "@aws-sdk/client-dynamodb";
import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { unmarshall } from "@aws-sdk/util-dynamodb";


export async function deleteSpace(event: APIGatewayProxyEvent, dynamodbClient: DynamoDBClient): Promise<APIGatewayProxyResult> {
    

    if(event.queryStringParameters && ('id' in event.queryStringParameters)) {
        
        const spaceId = event.queryStringParameters['id'];

        const deleteResult = await dynamodbClient.send(new DeleteItemCommand({
            TableName: process.env.TABLE_NAME,
            Key: {
                'id': { S: spaceId }
            }
        }));
        return {
            statusCode: 200,
            body: JSON.stringify(`Deleted space with id ${spaceId}`)
        }

    } return {
        statusCode: 400,
        body: JSON.stringify('Please provide an id')
    }
}