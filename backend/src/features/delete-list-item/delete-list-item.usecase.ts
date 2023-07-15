import type { DeleteListItemRepository } from './delete-list-item.repository';

export type DeleteListItemUsecase = ReturnType<typeof DeleteListItemUsecaseFactory>;

export const DeleteListItemUsecaseFactory = (repository: DeleteListItemRepository) => {
  const execute = async ({ listId, itemId }: { listId: string; itemId: string }) => {
    await repository.deleteListItem(listId, itemId);

    return {
      success: true,
      data: {
        listId,
        itemId,
      },
    };
  };

  return { execute };
};
