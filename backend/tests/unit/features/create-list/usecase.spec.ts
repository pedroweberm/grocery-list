import { describe, it } from 'mocha';
import { expect } from 'chai';
import { stub } from 'sinon';

import { CreateListUsecaseFactory } from '@features/create-list/create-list.usecase';

describe('Testing create list usecase', () => {
  const repositoryMock = {
    createListMember: stub().resolves({}),
  };

  const usecase = CreateListUsecaseFactory(repositoryMock);

  it('execute function should exist', () => {
    expect(usecase.execute).to.exist.and.be.a('function');
  });

  it('execute function return success', async () => {
    const response = await usecase.execute({ userId: 'test', name: 'test' });

    expect(response.success).to.equal(true);
  });
});
