import { describe, it } from 'mocha';
import { expect } from 'chai';
import { stub } from 'sinon';

import { handler } from '@features/test-feature';

describe('Example test', () => {
  const testFunction = stub();

  it('function should be called', () => {
    testFunction();

    expect(testFunction.callCount).to.be.equal(1);
  });

  it('handler should return statusCode 200', async () => {
    const response = await handler();

    expect(response.statusCode).to.be.equal(200);
  });
});
