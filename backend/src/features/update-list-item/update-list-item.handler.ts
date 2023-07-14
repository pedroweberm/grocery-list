import type { APIGatewayEvent } from 'aws-lambda';

import { DynamoDBClient } from '@clients/dynamodb';
import { config } from '@src/config';

export const UpdateListItemHandlerFactory = (dynamoDBClient: DynamoDBClient) => {
  const getUpdateAttributes = (data: { name?: string; status?: string }) => ({
    item_name: data.name,
    item_status: data.status,
  });

  const buildUpdateExpression = (attributes: { [key: string]: string | undefined }) =>
    Object.entries(attributes)
      .reduce((acc, [key, value]) => {
        return value ? `${acc} ${key}=:${key},` : acc;
      }, 'set')
      .slice(0, -1);

  const buildUpdateExpressionAttributeValues = (attributes: { [key: string]: string | undefined }) =>
    Object.entries(attributes).reduce((acc, [key, value]) => {
      return value ? { ...acc, [`:${key}`]: value } : acc;
    }, {});

  const handler = async (event: APIGatewayEvent) => {
    const data = JSON.parse(event.body ?? '{}');

    const listId = event.pathParameters?.listId;
    const itemId = event.pathParameters?.itemId;

    if (!listId || !itemId) {
      return { statusCode: 400, body: JSON.stringify({ success: false, message: 'List id and item id are required' }) };
    }

    const updatedItemAttributes = getUpdateAttributes(data);

    if (!updatedItemAttributes.item_name && !updatedItemAttributes.item_status) {
      return { statusCode: 400, body: JSON.stringify({ success: false, message: 'At least one attribute must be updated' }) };
    }

    const databaseResponse = await dynamoDBClient.update({
      TableName: config.dynamoDBTableName,
      Key: {
        partition_key: `list#${listId}`,
        sort_key: `list-item#${itemId}`,
      },
      UpdateExpression: buildUpdateExpression(updatedItemAttributes),
      ExpressionAttributeValues: buildUpdateExpressionAttributeValues(updatedItemAttributes),
      ConditionExpression: 'attribute_exists(partition_key) and attribute_exists(sort_key)',
    });

    console.log('response', databaseResponse);

    return {
      statusCode: 204,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true,
      },
      body: JSON.stringify({
        success: true,
        message: 'List item updated successfully',
        data,
      }),
    };
  };

  return { handler };
};
