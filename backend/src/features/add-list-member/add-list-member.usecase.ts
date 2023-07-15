import { CustomError } from '@src/helpers/error';

import type { AddListMemberRepository } from './add-list-member.repository';
import { AddListMemberErrorCodes } from './add-list-member.errors';

export type AddListMemberUsecase = ReturnType<typeof AddListMemberUsecaseFactory>;

export interface ListMember {
  listId: string;
  listOwnerId: string;
  createdAtTimestamp: number;
  listName: string;
  memberId: string;
}

export const AddListMemberUsecaseFactory = (repository: AddListMemberRepository) => {
  const execute = async ({ username, listId, userId }: { username: string; listId: string; userId: string }) => {
    const existingListMember = await repository.findListMember(listId, userId);

    if (!existingListMember) {
      throw new CustomError(AddListMemberErrorCodes.UserNotMemberOfList, 'Only existing list members can add new members');
    }

    const newMember = await repository.findUserByUsername(username);

    if (!newMember?.sub) {
      throw new CustomError(AddListMemberErrorCodes.UsernameNotFound, `Could not find user with username ${username}`);
    }

    const newMemberId = newMember.sub;

    const newListMember = {
      createdAtTimestamp: new Date().getTime(),
      listId,
      listName: existingListMember.listName,
      listOwnerId: existingListMember.listOwnerId,
      memberId: newMemberId,
    };

    await repository.createListMember(newListMember);

    return {
      success: true,
      data: newListMember,
    };
  };

  return { execute };
};
