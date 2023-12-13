import { DynamoDBClient, PutItemCommand } from "@aws-sdk/client-dynamodb";
import { marshall } from "@aws-sdk/util-dynamodb";
import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { v4 } from "uuid";
import { validateAsSpaceEntry } from "../shared/Validator";


export async function postSpaces(event: APIGatewayProxyEvent, dynamodbClient: DynamoDBClient): Promise<APIGatewayProxyResult> {
    const randomid = v4();
    const item = JSON.parse(event.body);
    item.id = randomid;
    validateAsSpaceEntry(item);

    const result = await dynamodbClient.send(new PutItemCommand({
        TableName: process.env.TABLE_NAME,
        Item: marshall(item)
    }))
    console.log('Result', result);
    return {
        statusCode: 201,
        body: JSON.stringify({id: randomid})
    }
}