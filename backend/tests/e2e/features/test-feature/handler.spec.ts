import { CloudFormation, SharedIniFileCredentials } from 'aws-sdk';
import axios, { AxiosInstance } from 'axios';

import { describe, it } from 'mocha';
import { expect, use } from 'chai';
import chaiAsPromised from 'chai-as-promised';

import { config } from '@src/config';

use(chaiAsPromised);

const credentials = new SharedIniFileCredentials({ profile: 'grocery-list-testing' });

const cloudformation = new CloudFormation({
  credentials,
  region: config.awsRegion,
});

const getApiURL = async (stackName: string) => {
  try {
    const resources = await cloudformation.describeStackResources({ StackName: stackName }).promise();

    const apiResource = resources.StackResources?.find(resource => resource.LogicalResourceId === 'ApiGatewayRestApi');

    if (!apiResource) {
      throw new Error('Could not find API resource');
    }

    const apiId = apiResource.PhysicalResourceId;

    return `https://${apiId}.execute-api.${config.awsRegion}.amazonaws.com`;
  } catch (error) {
    console.log('error while retrieving api url', error);

    throw error;
  }
};

describe('Example end to end test', () => {
  const stageName = process.env.STAGE_NAME;
  let httpClient: AxiosInstance;

  before(async () => {
    const apiURL = await getApiURL(`${config.serviceName}-${stageName}`);
    httpClient = axios.create({ baseURL: apiURL, validateStatus: () => true });
  });

  it('endpoint should return statusCode 200', async () => {
    const response = await httpClient.get(`${stageName}/test`);

    expect(response.status).to.be.equal(200);
  });
});
