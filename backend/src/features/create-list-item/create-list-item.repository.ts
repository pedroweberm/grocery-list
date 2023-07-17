import type { DynamoDBClient } from '@clients/dynamodb';
import { DatabaseEntityNames } from '@src/helpers/constants';
import { config } from '@src/config';

import type { ListItem } from './create-list-item.usecase';

export type CreateListItemRepository = ReturnType<typeof CreateListItemRepositoryFactory>;

export type DatabaseListItem = {
  partition_key: string;
  sort_key: string;
  item_created_by: string;
  created_at_timestamp: number;
  item_id: string;
  item_list_id: string;
  item_name: string;
  item_status: string;
  entity: string;
  item_updated_by?: string;
};

export function CreateListItemRepositoryFactory(dynamoDBClient: DynamoDBClient) {
  const listItemToDatabase = (listItem: ListItem): DatabaseListItem => ({
    partition_key: `${DatabaseEntityNames.List}#${listItem.itemListId}`,
    sort_key: `${DatabaseEntityNames.ListItem}#${listItem.itemId}`,
    item_created_by: listItem.itemCreatedBy,
    created_at_timestamp: listItem.createdAtTimestamp,
    item_id: listItem.itemId,
    item_list_id: listItem.itemListId,
    item_name: listItem.itemName,
    item_status: listItem.itemStatus,
    entity: DatabaseEntityNames.ListItem,
  });

  const createListItem = async (data: ListItem) => {
    const response = await dynamoDBClient.put({
      TableName: config.dynamoDBTableName,
      Item: listItemToDatabase(data),
    });

    return response;
  };

  return { createListItem };
}
