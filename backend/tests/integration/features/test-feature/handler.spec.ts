import { loadSharedConfigFiles } from '@aws-sdk/shared-ini-file-loader';
import { CloudFormationClient, DescribeStackResourcesCommand } from '@aws-sdk/client-cloudformation';
import axios, { AxiosInstance } from 'axios';

import { describe, it } from 'mocha';
import { expect, use } from 'chai';
import chaiAsPromised from 'chai-as-promised';

import { config } from '@src/config';

use(chaiAsPromised);

const getApiURL = async (stackName: string) => {
  try {
    const rawCredentials = (await loadSharedConfigFiles()).credentialsFile['grocery-list-testing'];

    const cloudformation = new CloudFormationClient({
      credentials: {
        accessKeyId: rawCredentials.aws_access_key_id ?? '',
        secretAccessKey: rawCredentials.aws_secret_access_key ?? '',
        sessionToken: rawCredentials.session_token,
      },
      region: config.awsRegion,
    });

    const resources = await cloudformation.send(new DescribeStackResourcesCommand({ StackName: stackName }));

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

describe('Example integration test', () => {
  const stageName = process.env.STAGE_NAME ?? 'dev';
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
