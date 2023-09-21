import { APIGatewayProxyEvent, APIGatewayProxyResult, Context } from "aws-lambda"


const s3Client = new S3Client({});

async function handler(event: APIGatewayProxyEvent, context: Context): Promise<APIGatewayProxyResult> {

    let message: string;
    
    switch (event.httpMethod) {
        case 'GET':
            message: "Hello from the GET side!"
            break;
        case 'POST':
            message: "Hello from the POST side!"
            break;
        default:
            break
    }

    const response: APIGatewayProxyResult = {
        statusCode: 200,
        body: JSON.stringify(message)
    }
    console.log('Event', event);

    return response;
}

export { handler }