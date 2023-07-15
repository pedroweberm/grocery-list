import type { DynamoDBClient } from '@clients/dynamodb';
import { DatabaseEntityNames } from '@src/helpers/constants';
import { config } from '@src/config';

export type DeleteListItemRepository = ReturnType<typeof DeleteListItemRepositoryFactory>;

export function DeleteListItemRepositoryFactory(dynamoDBClient: DynamoDBClient) {
  const deleteListItem = async (listId: string, itemId: string) => {
    const response = await dynamoDBClient.deleteItem({
      TableName: config.dynamoDBTableName,
      Key: {
        partition_key: `${DatabaseEntityNames.List}#${listId}`,
        sort_key: `${DatabaseEntityNames.ListItem}#${itemId}`,
      },
    });

    return response;
  };

  return { deleteListItem };
}
