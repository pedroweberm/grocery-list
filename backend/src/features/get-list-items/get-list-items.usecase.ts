import { ListItem } from '@features/create-list-item/create-list-item.usecase';

import { GetListItemsRepository } from './get-list-items.repository';

export type GetListItemsUsecase = ReturnType<typeof GetListItemsUsecaseFactory>;

export const GetListItemsUsecaseFactory = (repository: GetListItemsRepository) => {
  const listItemView = (listItem: ListItem) => ({
    id: listItem.itemId,
    name: listItem.itemName,
    status: listItem.itemStatus,
    ownerId: listItem.itemOwnerId,
    listId: listItem.itemListId,
    createdAtTimestamp: listItem.createdAtTimestamp,
  });

  const execute = async ({ listId }: { listId: string }) => {
    const databaseResponse = await repository.findListItems(listId);

    const items = databaseResponse.map(listItemView);

    return {
      success: true,
      data: items,
    };
  };

  return { execute };
};
