import { v4 as uuid } from 'uuid';

import { CreateListItemRepository } from './create-list-item.repository';

export type CreateListItemUsecase = ReturnType<typeof CreateListItemUsecaseFactory>;

export interface ListItem {
  itemCreatedBy: string;
  createdAtTimestamp: number;
  itemId: string;
  itemListId: string;
  itemName: string;
  itemStatus: string;
  itemUpdatedBy?: string;
}

export const CreateListItemUsecaseFactory = (repository: CreateListItemRepository) => {
  const execute = async ({ listId, name, userId }: { listId: string; name: string; userId: string }) => {
    const listItem: ListItem = {
      itemId: uuid(),
      itemListId: listId,
      itemCreatedBy: userId,
      createdAtTimestamp: new Date().getTime(),
      itemName: name,
      itemStatus: 'pending',
    };

    await repository.createListItem(listItem);

    return {
      success: true,
      data: listItem,
    };
  };

  return { execute };
};
