import { describe, it } from 'mocha';
import { expect } from 'chai';
import { stub } from 'sinon';

describe('Example unit test', () => {
  const testFunction = stub();

  it('function should be called', () => {
    testFunction();

    expect(testFunction.callCount).to.be.equal(1);
  });
});
