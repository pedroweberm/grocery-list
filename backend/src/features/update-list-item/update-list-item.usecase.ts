import { UpdateListItemRepository } from './update-list-item.repository';

export type UpdateListItemUsecase = ReturnType<typeof UpdateListItemUsecaseFactory>;

export interface ListItemUpdateAttributes {
  name?: string;
  status?: string;
}

export const UpdateListItemUsecaseFactory = (repository: UpdateListItemRepository) => {
  const execute = async ({ listId, itemId, name, status }: { listId: string; itemId: string; name?: string; status?: string }) => {
    const updateAttributes: ListItemUpdateAttributes = {
      name,
      status,
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
