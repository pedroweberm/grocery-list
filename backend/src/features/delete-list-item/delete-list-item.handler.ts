import type { APIGatewayEvent } from 'aws-lambda';

import type { DynamoDBClient } from '@clients/dynamodb';
import { config } from '@src/config';

export const DeleteListItemHandlerFactory = (dynamoDBClient: DynamoDBClient) => {
  const handler = async (event: APIGatewayEvent) => {
    const listId = event.pathParameters?.['listId'];
    const itemId = event.pathParameters?.['itemId'];

    if (!listId || !itemId) {
      return { statusCode: 400, body: JSON.stringify({ success: false, message: 'List id and item id are required' }) };
    }

    const databaseResponse = await dynamoDBClient.deleteItem({
      TableName: config.dynamoDBTableName,
      Key: {
        partition_key: `list#${listId}`,
        sort_key: `list-item#${itemId}`,
      },
    });

    console.log('response', databaseResponse);

    return {
      statusCode: 200,
      body: JSON.stringify({
        success: true,
        message: 'Item deleted successfully',
        data: {
          id: itemId,
        },
      }),
    };
  };

  return { handler };
};
