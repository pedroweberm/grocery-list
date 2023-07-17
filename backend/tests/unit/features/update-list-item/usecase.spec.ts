import { describe, it } from 'mocha';
import { expect } from 'chai';
import { stub } from 'sinon';

import { UpdateListItemUsecaseFactory } from '@features/update-list-item/update-list-item.usecase';

describe('Testing update list item usecase', () => {
  const repositoryMock = {
    updateListItem: stub().resolves([{}]),
  };

  const usecase = UpdateListItemUsecaseFactory(repositoryMock);

  it('execute function should exist', () => {
    expect(usecase.execute).to.exist.and.be.a('function');
  });

  it('execute function return success', async () => {
    const response = await usecase.execute({ itemId: 'test', listId: 'test', userId: 'test', name: 'test', status: 'test' });

    expect(response.success).to.equal(true);
  });
});
