import type { DynamoDBClient } from '@clients/dynamodb';
import { DatabaseEntityNames } from '@src/helpers/constants';
import { config } from '@src/config';
import { objectToUpdateExpression, objectToUpdateExpressionAttributeValues } from '@src/helpers/dynamodb';

import { ListItemUpdateAttributes } from './update-list-item.usecase';

export type UpdateListItemRepository = ReturnType<typeof UpdateListItemRepositoryFactory>;

export function UpdateListItemRepositoryFactory(dynamoDBClient: DynamoDBClient) {
  const listItemUpdateAttributesToDatabase = (data: ListItemUpdateAttributes) => ({
    item_name: data.name,
    item_status: data.status,
    item_updated_by: data.updatedBy,
  });

  const updateListItem = async (listId: string, itemId: string, updateAttributes: ListItemUpdateAttributes) => {
    const response = await dynamoDBClient.update({
      TableName: config.dynamoDBTableName,
      Key: {
        partition_key: `${DatabaseEntityNames.List}#${listId}`,
        sort_key: `${DatabaseEntityNames.ListItem}#${itemId}`,
      },
      UpdateExpression: objectToUpdateExpression(listItemUpdateAttributesToDatabase(updateAttributes)),
      ExpressionAttributeValues: objectToUpdateExpressionAttributeValues(listItemUpdateAttributesToDatabase(updateAttributes)),
      ConditionExpression: 'attribute_exists(partition_key) and attribute_exists(sort_key)',
    });

    return response;
  };

  return { updateListItem };
}
