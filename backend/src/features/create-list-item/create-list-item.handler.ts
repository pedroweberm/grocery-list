import type { APIGatewayEvent } from 'aws-lambda';
import { v4 as uuid } from 'uuid';

import { DynamoDBClient } from '@clients/dynamodb';
import { config } from '@src/config';

export const CreateListItemHandlerFactory = (dynamoDBClient: DynamoDBClient) => {
  const handler = async (event: APIGatewayEvent) => {
    const data = JSON.parse(event.body ?? '{}');
    const listId = event.pathParameters?.['id'];

    const listItem = {
      id: uuid(),
      listId,
      ownerId: event.requestContext.authorizer?.claims?.sub,
      createdAtTimestamp: new Date().getTime(),
      itemName: data.name,
      status: 'pending',
    };

    if (!listItem.ownerId) {
      return { statusCode: 400, body: JSON.stringify({ success: false, message: 'Could not find user id' }) };
    }

    const databaseResponse = await dynamoDBClient.put({
      TableName: config.dynamoDBTableName,
      Item: {
        partition_key: `list#${listItem.listId}`,
        sort_key: `list-item#${listItem.id}`,
        item_owner_id: listItem.ownerId,
        created_at_timestamp: listItem.createdAtTimestamp,
        item_name: listItem.itemName,
        item_status: listItem.status,
      },
    });

    console.log('response', databaseResponse);

    return {
      statusCode: 201,
      body: JSON.stringify({
        success: true,
        message: 'List item created successfully',
        data: listItem,
      }),
    };
  };

  return { handler };
};
