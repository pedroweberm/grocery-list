import { v4 as uuid } from 'uuid';

import type { CreateListRepository } from './create-list.repository';

export type CreateListUsecase = ReturnType<typeof CreateListUsecaseFactory>;

export interface ListMember {
  listId: string;
  listOwnerId: string;
  createdAtTimestamp: number;
  listName: string;
  memberId: string;
}

export const CreateListUsecaseFactory = (repository: CreateListRepository) => {
  const execute = async ({ userId, name }: { userId: string; name: string }) => {
    const listMember: ListMember = {
      listId: uuid(),
      listOwnerId: userId,
      createdAtTimestamp: new Date().getTime(),
      listName: name,
      memberId: userId,
    };

    await repository.createListMember(listMember);

    return {
      success: true,
      data: listMember,
    };
  };

  return { execute };
};
