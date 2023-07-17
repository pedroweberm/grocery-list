import type { DynamoDBClient } from '@clients/dynamodb';
import { DatabaseEntityNames } from '@src/helpers/constants';
import { config } from '@src/config';

import type { ListItem } from '@features/create-list-item/create-list-item.usecase';
import type { DatabaseListItem } from '@features/create-list-item/create-list-item.repository';

export type GetListItemsRepository = ReturnType<typeof GetListItemsRepositoryFactory>;

export function GetListItemsRepositoryFactory(dynamoDBClient: DynamoDBClient) {
  const databaseListItemToDomain = (databaseListItem: DatabaseListItem): ListItem => ({
    itemListId: databaseListItem.item_list_id,
    itemId: databaseListItem.item_id,
    itemCreatedBy: databaseListItem.item_created_by,
    itemName: databaseListItem.item_name,
    createdAtTimestamp: databaseListItem.created_at_timestamp,
    itemStatus: databaseListItem.item_status,
    itemUpdatedBy: databaseListItem.item_updated_by,
  });

  const findListItems = async (listId: string) => {
    const response = await dynamoDBClient.query({
      TableName: config.dynamoDBTableName,
      KeyConditionExpression: 'partition_key=:partition_key and begins_with(sort_key,:sort_key)',
      ExpressionAttributeValues: {
        ':partition_key': `${DatabaseEntityNames.List}#${listId}`,
        ':sort_key': `${DatabaseEntityNames.ListItem}`,
      },
    });

    const items = response.Items as DatabaseListItem[];

    return items.map(databaseListItemToDomain);
  };

  return { findListItems };
}
