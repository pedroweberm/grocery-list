import { describe, it } from 'mocha';
import { expect } from 'chai';
import { stub } from 'sinon';

import { GetListsUsecaseFactory } from '@features/get-lists/get-lists.usecase';

describe('Testing get lists usecase', () => {
  const repositoryMock = {
    findLists: stub().resolves([{}]),
  };

  const usecase = GetListsUsecaseFactory(repositoryMock);

  it('execute function should exist', () => {
    expect(usecase.execute).to.exist.and.be.a('function');
  });

  it('execute function return success', async () => {
    const response = await usecase.execute({ userId: 'test' });

    expect(response.success).to.equal(true);
  });
});
