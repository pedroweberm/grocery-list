import type { APIGatewayEvent } from 'aws-lambda';

import type { DynamoDBClient } from '@clients/dynamodb';
import { config } from '@src/config';

export const GetListsHandlerFactory = (dynamoDBClient: DynamoDBClient) => {
  const handler = async (event: APIGatewayEvent) => {
    const userId = event.requestContext.authorizer?.claims?.sub;

    if (!userId) {
      return { statusCode: 400, body: JSON.stringify({ success: false, message: 'Could not find user id' }) };
    }

    const databaseResponse = await dynamoDBClient.query({
      TableName: config.dynamoDBTableName,
      KeyConditionExpression: 'partition_key=:partition_key and begins_with(sort_key, :sort_key)',
      ExpressionAttributeValues: {
        ':partition_key': `list-member#${userId}`,
        ':sort_key': `list`,
      },
    });

    console.log('response', databaseResponse);

    const lists = databaseResponse.Items?.map(databaseList => ({
      id: databaseList['list_id'],
      name: databaseList['list_name'],
      ownerId: databaseList['list_owner_id'],
      createdAtTimestamp: databaseList['created_at_timestamp'],
    }));

    return {
      statusCode: 200,
      body: JSON.stringify({
        success: true,
        message: 'Lists retrieved successfully',
        data: lists,
      }),
    };
  };

  return { handler };
};
