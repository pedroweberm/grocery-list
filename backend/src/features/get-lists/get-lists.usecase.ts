import { ListMember } from '@features/create-list/create-list.usecase';

import { GetListsRepository } from './get-lists.repository';

export type GetListsUsecase = ReturnType<typeof GetListsUsecaseFactory>;

export const GetListsUsecaseFactory = (repository: GetListsRepository) => {
  const listMemberView = (listMember: ListMember) => ({
    id: listMember.listId,
    name: listMember.listName,
    ownerId: listMember.listOwnerId,
    createdAtTimestamp: listMember.createdAtTimestamp,
  });

  const execute = async ({ userId }: { userId: string }) => {
    const databaseResponse = await repository.findLists(userId);

    const lists = databaseResponse.map(listMemberView);

    return {
      success: true,
      data: lists,
    };
  };

  return { execute };
};
