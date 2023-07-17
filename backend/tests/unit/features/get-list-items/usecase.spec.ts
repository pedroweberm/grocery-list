import { describe, it } from 'mocha';
import { expect } from 'chai';
import { stub } from 'sinon';

import { GetListItemsUsecaseFactory } from '@features/get-list-items/get-list-items.usecase';

describe('Testing get list items usecase', () => {
  const repositoryMock = {
    findListItems: stub().resolves([{}]),
  };

  const usecase = GetListItemsUsecaseFactory(repositoryMock);

  it('execute function should exist', () => {
    expect(usecase.execute).to.exist.and.be.a('function');
  });

  it('execute function return success', async () => {
    const response = await usecase.execute({ listId: 'test' });

    expect(response.success).to.equal(true);
  });
});
