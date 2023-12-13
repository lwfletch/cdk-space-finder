import { DynamoDBClient, GetItemCommand, ScanCommand } from "@aws-sdk/client-dynamodb";
import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { unmarshall } from "@aws-sdk/util-dynamodb";


export async function getSpaces(event: APIGatewayProxyEvent, dynamodbClient: DynamoDBClient): Promise<APIGatewayProxyResult> {
    

    if(event.queryStringParameters) {
        if('id' in event.queryStringParameters) {
           const spaceId = event.queryStringParameters['id']
           const getItemResponse = await dynamodbClient.send(new GetItemCommand({
                TableName: process.env.TABLE_NAME,
                Key: {
                    'id': { S: spaceId }
                }
           }))
           if(getItemResponse.Item) {
            const unmarshalledItem = unmarshall(getItemResponse.Item)
               return {
                   statusCode: 200,
                   body: JSON.stringify(unmarshalledItem)
               }
           } else {
            return {
                statusCode: 404,
                body: JSON.stringify(`Space with id ${spaceId} not found`)
            }
           }
        } else {
            return {
                statusCode: 400,
                body: JSON.stringify('id is required')
            }
        }
    }


    const result = await dynamodbClient.send(new ScanCommand({
        TableName: process.env.TABLE_NAME,
    }))
    const unmarshalledItems = result.Items?.map(item => unmarshall(item));
    console.log('Result Items', unmarshalledItems);
    return {
        statusCode: 201,
        body: JSON.stringify(unmarshalledItems)
    }
}