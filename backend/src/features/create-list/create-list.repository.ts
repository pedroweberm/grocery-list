import type { DynamoDBClient } from '@clients/dynamodb';
import { DatabaseEntityNames } from '@src/helpers/constants';
import { config } from '@src/config';

import type { ListMember } from './create-list.usecase';

export type CreateListRepository = ReturnType<typeof CreateListRepositoryFactory>;

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

export function CreateListRepositoryFactory(dynamoDBClient: DynamoDBClient) {
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

  const createListMember = async (data: ListMember) => {
    const response = await dynamoDBClient.put({
      TableName: config.dynamoDBTableName,
      Item: listMemberToDatabase(data),
    });

    return response;
  };

  return { createListMember };
}
