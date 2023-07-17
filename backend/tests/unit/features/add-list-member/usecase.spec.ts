import { describe, it } from 'mocha';
import { expect } from 'chai';
import { stub } from 'sinon';

import { AddListMemberUsecaseFactory } from '@features/add-list-member/add-list-member.usecase';

describe('Testing add list member usecase', () => {
  const repositoryMock = {
    findListMember: stub().resolves({}),
    findUserByUsername: stub().resolves({ sub: 'test' }),
    createListMember: stub().resolves({}),
  };

  const usecase = AddListMemberUsecaseFactory(repositoryMock);

  it('execute function should exist', () => {
    expect(usecase.execute).to.exist.and.be.a('function');
  });

  it('execute function return success', async () => {
    const response = await usecase.execute({ userId: 'test', username: 'test', listId: 'string' });

    expect(response.success).to.equal(true);
  });
});
