import type { DynamoDBClient } from '@clients/dynamodb';
import { DatabaseEntityNames } from '@src/helpers/constants';
import { config } from '@src/config';

import type { DatabaseListMember } from '@features/create-list/create-list.repository';
import type { ListMember } from '@features/create-list/create-list.usecase';

export type GetListsRepository = ReturnType<typeof GetListsRepositoryFactory>;

export function GetListsRepositoryFactory(dynamoDBClient: DynamoDBClient) {
  const databaseListMemberToDomain = (databaseListMember: DatabaseListMember): ListMember => ({
    listId: databaseListMember.list_id,
    listName: databaseListMember.list_name,
    listOwnerId: databaseListMember.list_owner_id,
    memberId: databaseListMember.list_member_id,
    createdAtTimestamp: databaseListMember.created_at_timestamp,
  });

  const findLists = async (userId: string) => {
    const response = await dynamoDBClient.query({
      TableName: config.dynamoDBTableName,
      KeyConditionExpression: 'partition_key=:partition_key and begins_with(sort_key,:sort_key)',
      ExpressionAttributeValues: {
        ':partition_key': `${DatabaseEntityNames.ListMember}#${userId}`,
        ':sort_key': `${DatabaseEntityNames.List}`,
      },
    });

    const items = response.Items as DatabaseListMember[];

    return items.map(databaseListMemberToDomain);
  };

  return { findLists };
}
