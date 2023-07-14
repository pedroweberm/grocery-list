import type { APIGatewayEvent } from 'aws-lambda';
import { v4 as uuid } from 'uuid';

import { DynamoDBClient } from '@clients/dynamodb';
import { config } from '@src/config';

export const CreateListHandlerFactory = (dynamoDBClient: DynamoDBClient) => {
  const handler = async (event: APIGatewayEvent) => {
    const data = JSON.parse(event.body ?? '{}');

    const list = {
      id: uuid(),
      ownerId: event.requestContext.authorizer?.claims?.sub,
      createdAtTimestamp: new Date().getTime(),
      name: data.name,
    };

    if (!list.ownerId) {
      return { statusCode: 400, body: JSON.stringify({ success: false, message: 'Could not find user id' }) };
    }

    const databaseResponse = await dynamoDBClient.put({
      TableName: config.dynamoDBTableName,
      Item: {
        partition_key: `list-member#${list.ownerId}`,
        sort_key: `list#${list.id}`,
        list_id: list.id,
        list_owner_id: list.ownerId,
        created_at_timestamp: list.createdAtTimestamp,
        list_name: list.name,
        entity: 'list-member',
      },
    });

    console.log('response', databaseResponse);

    return {
      statusCode: 201,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true,
      },
      body: JSON.stringify({
        success: true,
        message: 'List created successfully',
        data: list,
      }),
    };
  };

  return { handler };
};
