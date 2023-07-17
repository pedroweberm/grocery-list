import { describe, it } from 'mocha';
import { expect } from 'chai';
import { stub } from 'sinon';

import { CreateListItemUsecaseFactory } from '@features/create-list-item/create-list-item.usecase';

describe('Testing create list item usecase', () => {
  const repositoryMock = {
    createListItem: stub().resolves({}),
  };

  const usecase = CreateListItemUsecaseFactory(repositoryMock);

  it('execute function should exist', () => {
    expect(usecase.execute).to.exist.and.be.a('function');
  });

  it('execute function return success', async () => {
    const response = await usecase.execute({ listId: 'test', name: 'test', userId: 'test' });

    expect(response.success).to.equal(true);
  });
});
