import type { APIGatewayEvent } from 'aws-lambda';

import type { DynamoDBClient } from '@clients/dynamodb';
import { config } from '@src/config';

export const GetListItemsHandlerFactory = (dynamoDBClient: DynamoDBClient) => {
  const handler = async (event: APIGatewayEvent) => {
    const listId = event.pathParameters?.['listId'];

    if (!listId) {
      return { statusCode: 400, body: JSON.stringify({ success: false, message: 'List id is required' }) };
    }

    const databaseResponse = await dynamoDBClient.query({
      TableName: config.dynamoDBTableName,
      KeyConditionExpression: 'partition_key=:partition_key and begins_with(sort_key, :sort_key)',
      ExpressionAttributeValues: {
        ':partition_key': `list#${listId}`,
        ':sort_key': 'list-item',
      },
    });

    console.log('response', databaseResponse);

    const items = databaseResponse.Items?.map(databaseItem => ({
      id: databaseItem['item_id'],
      name: databaseItem['item_name'],
      status: databaseItem['item_status'],
      ownerId: databaseItem['item_owner_id'],
      listId: databaseItem['item_list_id'],
      createdAtTimestamp: databaseItem['created_at_timestamp'],
    }));

    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true,
      },
      body: JSON.stringify({
        success: true,
        message: 'Items retrieved successfully',
        data: items,
      }),
    };
  };

  return { handler };
};
