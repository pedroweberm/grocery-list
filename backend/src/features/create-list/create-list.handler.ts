import type { APIGatewayEvent } from 'aws-lambda';
import { v4 as uuid } from 'uuid';

import { DynamoDBClient } from '@clients/dynamodb';
import { config } from '@src/config';

export const CreateListHandlerFactory = (dynamoDBClient: DynamoDBClient) => {
  const handler = async (event: APIGatewayEvent) => {
    const data = JSON.parse(event.body ?? '{}');

    const list = {
      id: uuid(),
      ownerId: data.userId,
      createdAtTimestamp: new Date().getTime(),
    };

    const databaseResponse = await dynamoDBClient.put({
      TableName: config.dynamoDBTableName,
      Item: {
        partition_key: `list-member#${data.userId}`,
        sort_key: `list#${list.id}`,
        list_id: list.id,
        list_owner_id: list.ownerId,
        created_at_timestamp: list.createdAtTimestamp,
      },
    });

    console.log('response', databaseResponse);

    return {
      statusCode: 201,
      body: JSON.stringify({
        success: true,
        message: 'List created successfully',
        data: list,
      }),
    };
  };

  return { handler };
};
