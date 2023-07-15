import type { AttributeType } from '@aws-sdk/client-cognito-identity-provider';

import type { DynamoDBClient } from '@clients/dynamodb';
import type { CognitoClient } from '@clients/cognito';
import { DatabaseEntityNames } from '@src/helpers/constants';
import { config } from '@src/config';

import type { ListMember } from './add-list-member.usecase';

export type AddListMemberRepository = ReturnType<typeof AddListMemberRepositoryFactory>;

export interface DatabaseListMember {
  partition_key: string;
  sort_key: string;
  list_id: string;
  list_owner_id: string;
  created_at_timestamp: number;
  list_name: string;
  list_member_id: string;
  entity: string;
}

export function AddListMemberRepositoryFactory(dynamoDBClient: DynamoDBClient, cognitoClient: CognitoClient) {
  const databaseListMemberToDomain = (databaseListMember: DatabaseListMember): ListMember => ({
    listId: databaseListMember.list_id,
    listName: databaseListMember.list_name,
    listOwnerId: databaseListMember.list_owner_id,
    memberId: databaseListMember.list_member_id,
    createdAtTimestamp: databaseListMember.created_at_timestamp,
  });

  const listMemberToDatabase = (listMember: ListMember): DatabaseListMember => ({
    partition_key: `${DatabaseEntityNames.ListMember}#${listMember.memberId}`,
    sort_key: `${DatabaseEntityNames.List}#${listMember.listId}`,
    list_id: listMember.listId,
    list_owner_id: listMember.listOwnerId,
    created_at_timestamp: listMember.createdAtTimestamp,
    list_name: listMember.listName,
    list_member_id: listMember.memberId,
    entity: DatabaseEntityNames.ListMember,
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

  const createListMember = async (data: ListMember) => {
    const response = await dynamoDBClient.put({
      TableName: config.dynamoDBTableName,
      Item: listMemberToDatabase(data),
    });

    return response;
  };

  return { findListMember, findUserByUsername, createListMember };
}
