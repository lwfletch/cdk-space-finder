import { handler } from "../src/services/hello";

process.env.AWS_REGION = 'us-east-1'
// process.env.TABLE_NAME = 'SpacesTable-<logical_id>'

handler({
    httpMethod: 'PUT',
    queryStringParameters: {
        id: '1234'
    },
    body: JSON.stringify({
        location: 'Raleigh'
    })
} as any, {} as any)