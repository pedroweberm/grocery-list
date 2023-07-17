import { describe, it } from 'mocha';
import { expect } from 'chai';
import { stub } from 'sinon';

import { DeleteListItemUsecaseFactory } from '@features/delete-list-item/delete-list-item.usecase';

describe('Testing delete list item usecase', () => {
  const repositoryMock = {
    deleteListItem: stub().resolves({}),
  };

  const usecase = DeleteListItemUsecaseFactory(repositoryMock);

  it('execute function should exist', () => {
    expect(usecase.execute).to.exist.and.be.a('function');
  });

  it('execute function return success', async () => {
    const response = await usecase.execute({ listId: 'test', itemId: 'test' });

    expect(response.success).to.equal(true);
  });
});
