import { APIGatewayProxyEvent, APIGatewayProxyResult, Context } from "aws-lambda"
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { postSpaces } from "./PostSpaces";
import { getSpaces } from "./GetSpaces";
import { updateSpace } from "./UpdateSpace";
import { deleteSpace } from "./DeleteSpace";
import { JSONError, MissingFieldError } from "../shared/Validator";

const dynamodbClient = new DynamoDBClient({});

async function handler(event: APIGatewayProxyEvent, context: Context): Promise<APIGatewayProxyResult> {

    let message: string;

    try {
        switch (event.httpMethod) {
            case 'GET':
                const getResponse = await getSpaces(event, dynamodbClient);
                return getResponse;
            case 'POST':
                const postResponse = postSpaces(event, dynamodbClient);
                return postResponse;
            case 'PUT':
                const putResponse = await updateSpace(event, dynamodbClient);
                return putResponse;
            case 'DELETE':
                const deleteResponse = await deleteSpace(event, dynamodbClient);
                return deleteResponse;
            default:
                break
        }
    } catch (error) {
        console.error(error);
        if(error instanceof MissingFieldError) {
            return {
                statusCode: 400,
                body: JSON.stringify(error.message)
            }
        }
        if(error instanceof JSONError) {
            return {
                statusCode: 400,
                body: error.message
            }
        }
        return {
            statusCode: 500,
            body: JSON.stringify(error)
        }
    }

    const response: APIGatewayProxyResult = {
        statusCode: 200,
        body: JSON.stringify(message)
    }
    console.log('Event', event);

    return response;
}

export { handler }