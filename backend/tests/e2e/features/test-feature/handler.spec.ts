import { describe, it } from 'mocha';
import { expect } from 'chai';
import { stub } from 'sinon';

import { handler } from '@features/test-feature';

describe('Example end to end test', () => {
  const testFunction = stub();
  console.log('Running integration test for stage', process.env.STAGE_NAME);

  it('function should be called', () => {
    testFunction();

    expect(testFunction.callCount).to.be.equal(1);
  });

  it('handler should return statusCode 200', async () => {
    const response = await handler();

    expect(response.statusCode).to.be.equal(200);
  });
});
