import type { APIGatewayEvent } from 'aws-lambda';

import type { DynamoDBClient } from '@clients/dynamodb';
import type { CognitoClient } from '@clients/cognito';
import { config } from '@src/config';

export const AddListMemberHandlerFactory = (dynamoDBClient: DynamoDBClient, cognitoClient: CognitoClient) => {
  const handler = async (event: APIGatewayEvent) => {
    const body = JSON.parse(event.body ?? '{}');
    const listId = event.pathParameters?.listId;

    const userId = event.requestContext.authorizer?.claims?.sub;

    if (!userId) {
      return { statusCode: 400, body: JSON.stringify({ success: false, message: 'Could not find user id' }) };
    }

    if (!listId) {
      return { statusCode: 400, body: JSON.stringify({ success: false, message: 'Could not find list id' }) };
    }

    const existingListMember = await dynamoDBClient.query({
      TableName: config.dynamoDBTableName,
      KeyConditionExpression: 'partition_key=:partition_key and sort_key=:sort_key',
      ExpressionAttributeValues: {
        ':partition_key': `list-member#${userId}`,
        ':sort_key': `list#${listId}`,
      },
    });

    if (existingListMember.Count === 0) {
      return { statusCode: 400, body: JSON.stringify({ success: false, message: 'Only existing list members can add new members' }) };
    }

    const newMember = await cognitoClient.adminGetUser({ UserPoolId: config.cognitoUserPoolId, Username: body.username });

    if (!newMember) {
      return { statusCode: 404, body: JSON.stringify({ success: false, message: `Could not find user with username ${body.username}` }) };
    }

    const newMemberId = newMember.UserAttributes?.find(attribute => attribute.Name === 'sub')?.Value;

    const databaseResponse = await dynamoDBClient.put({
      TableName: config.dynamoDBTableName,
      Item: {
        ...existingListMember,
        partition_key: `list-member#${newMemberId}`,
        sort_key: `list#${listId}`,
      },
    });

    console.log('response', databaseResponse);

    return {
      statusCode: 201,
      body: JSON.stringify({
        success: true,
        message: 'Member added successfully',
        data: databaseResponse.Attributes,
      }),
    };
  };

  return { handler };
};
