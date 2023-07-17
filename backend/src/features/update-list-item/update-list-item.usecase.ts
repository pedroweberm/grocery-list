import { UpdateListItemRepository } from './update-list-item.repository';

export type UpdateListItemUsecase = ReturnType<typeof UpdateListItemUsecaseFactory>;

export interface ListItemUpdateAttributes {
  name?: string;
  status?: string;
  updatedBy: string;
}

export const UpdateListItemUsecaseFactory = (repository: UpdateListItemRepository) => {
  const execute = async ({
    listId,
    itemId,
    name,
    status,
    userId,
  }: {
    listId: string;
    itemId: string;
    name?: string;
    status?: string;
    userId: string;
  }) => {
    const updateAttributes: ListItemUpdateAttributes = {
      name,
      status,
      updatedBy: userId,
    };

    await repository.updateListItem(listId, itemId, updateAttributes);

    return {
      success: true,
      data: {
        listId,
        itemId,
        name,
        status,
      },
    };
  };

  return { execute };
};
