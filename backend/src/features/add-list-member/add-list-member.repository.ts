import type { AttributeType } from '@aws-sdk/client-cognito-identity-provider';

import type { DynamoDBClient } from '@clients/dynamodb';
import type { CognitoClient } from '@clients/cognito';
import { DatabaseEntityNames } from '@src/helpers/constants';
import { config } from '@src/config';

import type { ListMember } from '@features/create-list/create-list.usecase';
import { CreateListRepositoryFactory, DatabaseListMember } from '@features/create-list/create-list.repository';

export type AddListMemberRepository = ReturnType<typeof AddListMemberRepositoryFactory>;

export function AddListMemberRepositoryFactory(dynamoDBClient: DynamoDBClient, cognitoClient: CognitoClient) {
  const databaseListMemberToDomain = (databaseListMember: DatabaseListMember): ListMember => ({
    listId: databaseListMember.list_id,
    listName: databaseListMember.list_name,
    listOwnerId: databaseListMember.list_owner_id,
    memberId: databaseListMember.list_member_id,
    createdAtTimestamp: databaseListMember.created_at_timestamp,
  });

  const findListMember = async (listId: string, userId: string) => {
    const response = await dynamoDBClient.query({
      TableName: config.dynamoDBTableName,
      KeyConditionExpression: 'partition_key=:partition_key and sort_key=:sort_key',
      ExpressionAttributeValues: {
        ':partition_key': `${DatabaseEntityNames.ListMember}#${userId}`,
        ':sort_key': `${DatabaseEntityNames.List}#${listId}`,
      },
    });

    const member = response.Items?.[0] as DatabaseListMember | undefined;

    return member ? databaseListMemberToDomain(member) : undefined;
  };

  const cognitoAttributesToObject = (attributes: AttributeType[]) =>
    attributes.reduce((acc, elem) => {
      return elem.Name ? { ...acc, [elem.Name]: elem.Value } : acc;
    }, {});

  const findUserByUsername = async (username: string) => {
    const response = await cognitoClient.adminGetUser({ UserPoolId: config.cognitoUserPoolId, Username: username });

    return cognitoAttributesToObject(response.UserAttributes ?? []) as { sub: string };
  };

  return { findListMember, findUserByUsername, createListMember: CreateListRepositoryFactory(dynamoDBClient).createListMember };
}
