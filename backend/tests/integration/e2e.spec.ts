import { loadSharedConfigFiles } from '@aws-sdk/shared-ini-file-loader';
import { CloudFormationClient, DescribeStackResourcesCommand, StackResource } from '@aws-sdk/client-cloudformation';
import {
  CognitoIdentityProviderClient,
  AdminCreateUserCommand,
  AdminDeleteUserCommand,
  AdminSetUserPasswordCommand,
  AdminInitiateAuthCommand,
  AdminRespondToAuthChallengeCommand,
} from '@aws-sdk/client-cognito-identity-provider';
import axios, { AxiosInstance } from 'axios';

import { describe, it } from 'mocha';
import { expect, use } from 'chai';
import chaiAsPromised from 'chai-as-promised';

import { config } from '@src/config';

use(chaiAsPromised);

const getResourcesForStage = async (stageName: string) => {
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

    const resources = await cloudformation.send(new DescribeStackResourcesCommand({ StackName: `${config.serviceName}-${stageName}` }));

    return resources.StackResources;
  } catch (error) {
    console.log(`Error while retrieving resources for stage ${stageName}`);

    throw error;
  }
};

const getApiURL = (resources: StackResource[]) => {
  const apiResource = resources.find(resource => resource.LogicalResourceId === 'ApiGatewayRestApi');

  if (!apiResource) {
    throw new Error('Could not find API resource');
  }

  const apiId = apiResource.PhysicalResourceId;

  return `https://${apiId}.execute-api.${config.awsRegion}.amazonaws.com`;
};

const getUserPoolId = (resources: StackResource[]) => {
  const cognitoResource = resources.find(resource => resource.LogicalResourceId === 'GroceryListCognitoUserPool');

  const userPoolId = cognitoResource?.PhysicalResourceId;

  if (!userPoolId) {
    throw new Error('Could not find Cognito User Pool resource');
  }
  return userPoolId;
};

const getUserPoolClientId = (resources: StackResource[]) => {
  const cognitoClientResource = resources.find(resource => resource.LogicalResourceId === 'GroceryListCognitoUserPoolWebClient');

  const userPoolClientId = cognitoClientResource?.PhysicalResourceId;

  if (!userPoolClientId) {
    throw new Error('Could not find Cognito User Pool Client resource');
  }

  return userPoolClientId;
};

const createTestUser = async (userPoolId: string, userPoolClientId: string, stageName: string, userIndex: string) => {
  const username = `test-user-${stageName}-${userIndex}`;
  const tempPassword = 'T3mp-password';
  const finalPassword = 'T3st-password';
  const email = `test.${userIndex}@email.com`;
  const phoneNumber = `+555198765432${userIndex}`;
  const name = `Test User ${userIndex}`;

  const cognitoClient = new CognitoIdentityProviderClient({ region: config.awsRegion });

  const createUserResponse = await cognitoClient.send(
    new AdminCreateUserCommand({
      Username: username,
      UserPoolId: userPoolId,
      TemporaryPassword: tempPassword,
      MessageAction: 'SUPPRESS',
      UserAttributes: [
        {
          Name: 'email_verified',
          Value: 'True',
        },
        {
          Name: 'email',
          Value: email,
        },
        {
          Name: 'phone_number',
          Value: phoneNumber,
        },
        {
          Name: 'preferred_username',
          Value: username,
        },
        {
          Name: 'name',
          Value: name,
        },
      ],
    }),
  );

  const _setUserPasswordResponse = await cognitoClient.send(
    new AdminSetUserPasswordCommand({
      Password: finalPassword,
      Username: username,
      UserPoolId: userPoolId,
    }),
  );

  const initiateAuthResponse = await cognitoClient.send(
    new AdminInitiateAuthCommand({
      AuthFlow: 'ADMIN_NO_SRP_AUTH',
      ClientId: userPoolClientId,
      UserPoolId: userPoolId,
      AuthParameters: {
        USERNAME: username,
        PASSWORD: finalPassword,
      },
    }),
  );

  const respondToChallengeResponse = await cognitoClient.send(
    new AdminRespondToAuthChallengeCommand({
      ChallengeName: initiateAuthResponse.ChallengeName,
      ClientId: userPoolClientId,
      UserPoolId: userPoolId,
      Session: initiateAuthResponse.Session,
      ChallengeResponses: {
        USERNAME: initiateAuthResponse.ChallengeParameters?.['USER_ID_FOR_SRP'] ?? '',
        NEW_PASSWORD: finalPassword,
      },
    }),
  );

  return {
    id: createUserResponse.User?.Attributes?.find(attr => attr.Name === 'sub')?.Value ?? '',
    username,
    password: finalPassword,
    token: respondToChallengeResponse.AuthenticationResult?.IdToken ?? '',
  };
};

const deleteTestUser = async (username: string, userPoolId: string) => {
  const cognitoClient = new CognitoIdentityProviderClient({ region: config.awsRegion });

  await cognitoClient.send(new AdminDeleteUserCommand({ Username: username, UserPoolId: userPoolId }));

  return username;
};

const replacePathParameters = (path: string, values: { [key: string]: string }) =>
  Object.entries(values).reduce((acc, [key, value]) => acc.replace(`:${key}`, value), path);

describe('Testing end to end flow', () => {
  const stageName = process.env.STAGE_NAME ?? 'dev';
  let httpClient: AxiosInstance;
  let primaryUser: { id: string; username: string; password: string; token: string };
  let secondaryUser: { id: string; username: string; password: string; token: string };
  let userPoolId: string;
  const invalidHeaders = { ['Authorization']: 'invalid token' };

  const requests: { [key: string]: { endpoint: string; input?: any; output?: any } } = {
    createList: {
      endpoint: `/${stageName}/lists`,
      input: {
        name: 'Test list 3',
      },
    },
    getLists: { endpoint: `/${stageName}/lists` },
    addListMember: { endpoint: `/${stageName}/lists/:listId/members` },
    createListItem: { endpoint: `/${stageName}/lists/:listId/items`, input: { name: 'Test item 1' } },
    updateListItem: { endpoint: `/${stageName}/lists/:listId/items/:itemId`, input: { status: 'done' } },
    deleteListItem: { endpoint: `/${stageName}/lists/:listId/items/:itemId` },
    getListItems: { endpoint: `/${stageName}/lists/:listId/items` },
  };

  before(async () => {
    const resources = (await getResourcesForStage(stageName)) ?? [];
    const userPoolClientId = getUserPoolClientId(resources);
    const apiUrl = getApiURL(resources);
    userPoolId = getUserPoolId(resources);
    primaryUser = await createTestUser(userPoolId, userPoolClientId, stageName, '1');
    secondaryUser = await createTestUser(userPoolId, userPoolClientId, stageName, '2');
    requests.addListMember.input = { username: secondaryUser.username };
    httpClient = axios.create({ baseURL: apiUrl, validateStatus: () => true, headers: { Authorization: `Bearer ${primaryUser.token}` } });
  });

  after(async () => {
    deleteTestUser(primaryUser.username, userPoolId);
    deleteTestUser(secondaryUser.username, userPoolId);
  });

  describe('Testing list creation', () => {
    it('endpoint should return status code UNAUTHORIZED for invalid token', async () => {
      const response = await httpClient.post(requests.createList.endpoint, requests.createList.input, { headers: invalidHeaders });

      expect(response.status).to.be.equal(401);
    });

    it('endpoint should return status code CREATED for valid request', async () => {
      const response = await httpClient.post(requests.createList.endpoint, requests.createList.input);

      requests.createList.output = response.data.data;

      expect(response.status).to.be.equal(201);
    });
  });

  describe('Testing lists retrieval', () => {
    it('endpoint should return status code UNAUTHORIZED for invalid token', async () => {
      const response = await httpClient.get(requests.getLists.endpoint, { headers: invalidHeaders });

      expect(response.status).to.be.equal(401);
    });

    it('endpoint should return status code OK for valid request', async () => {
      const response = await httpClient.get(requests.getLists.endpoint);

      requests.getLists.output = response.data.data;

      expect(response.status).to.be.equal(200);
    });

    it('endpoint should return list that was created previously and have all expected fields', async () => {
      const list: { createdAtTimestamp: string; id: string; name: string; ownerId: string } = requests.getLists.output.find(
        (list: { createdAtTimestamp: string; id: string; name: string; ownerId: string }) => list.id === requests.createList.output.id,
      );

      expect(list).to.not.equal(undefined);
      expect(list?.createdAtTimestamp).to.exist.and.be.a('number');
      expect(list?.id).to.exist.and.be.a('string');
      expect(list?.name).to.exist.and.be.a('string');
      expect(list?.ownerId).to.exist.and.be.a('string');
    });
  });

  describe('Testing list sharing', () => {
    it('endpoint should return status code UNAUTHORIZED for invalid token', async () => {
      const response = await httpClient.post(
        replacePathParameters(requests.addListMember.endpoint, { listId: requests.createList.output.id }),
        requests.addListMember.input,
        { headers: invalidHeaders },
      );

      expect(response.status).to.be.equal(401);
    });

    it('endpoint should return status code CREATED for valid request', async () => {
      const response = await httpClient.post(
        replacePathParameters(requests.addListMember.endpoint, { listId: requests.createList.output.id }),
        requests.addListMember.input,
      );

      requests.addListMember.output = response.data.data;

      expect(response.status).to.be.equal(201);
    });
  });

  describe('Testing creation of list items', () => {
    it('endpoint should return status code UNAUTHORIZED for invalid token', async () => {
      const response = await httpClient.post(
        replacePathParameters(requests.createListItem.endpoint, { listId: requests.createList.output.id }),
        requests.createListItem.input,
        { headers: invalidHeaders },
      );

      expect(response.status).to.be.equal(401);
    });

    it('endpoint should return status code CREATED for valid request', async () => {
      const response = await httpClient.post(
        replacePathParameters(requests.createListItem.endpoint, { listId: requests.createList.output.id }),
        requests.createListItem.input,
      );

      requests.createListItem.output = response.data.data;

      expect(response.status).to.be.equal(201);
    });
  });

  describe('Testing list item update', () => {
    it('endpoint should return status code UNAUTHORIZED for invalid token', async () => {
      const response = await httpClient.patch(
        replacePathParameters(requests.updateListItem.endpoint, { listId: requests.createList.output.id, itemId: requests.createListItem.output.id }),
        requests.updateListItem.input,
        { headers: invalidHeaders },
      );

      expect(response.status).to.be.equal(401);
    });

    it('endpoint should return status code NO_CONTENT for valid request', async () => {
      const response = await httpClient.patch(
        replacePathParameters(requests.updateListItem.endpoint, { listId: requests.createList.output.id, itemId: requests.createListItem.output.id }),
        requests.updateListItem.input,
      );

      requests.updateListItem.output = response.data.data;

      expect(response.status).to.be.equal(204);
    });
  });

  describe('Testing list items retrieval', () => {
    it('endpoint should return status code UNAUTHORIZED for invalid token', async () => {
      const response = await httpClient.get(replacePathParameters(requests.getListItems.endpoint, { listId: requests.createList.output.id }), {
        headers: invalidHeaders,
      });

      expect(response.status).to.be.equal(401);
    });

    it('endpoint should return status code OK for valid request', async () => {
      const response = await httpClient.get(replacePathParameters(requests.getListItems.endpoint, { listId: requests.createList.output.id }));

      requests.getListItems.output = response.data.data;

      expect(response.status).to.be.equal(200);
    });

    it('endpoint should return item that was created previously and have all expected fields', async () => {
      const createdItem: { id: string; name: string; status: string; ownerId: string; listId: string; createdAtTimestamp: string } =
        requests.getListItems.output.find(
          (item: { id: string; name: string; status: string; ownerId: string; listId: string; createdAtTimestamp: string }) =>
            item.id === requests.createListItem.output.id,
        );

      expect(createdItem).to.not.equal(undefined);
      expect(createdItem?.createdAtTimestamp).to.exist.and.be.a('number');
      expect(createdItem?.id).to.exist.and.be.a('string');
      expect(createdItem?.name).to.exist.and.be.a('string');
      expect(createdItem?.ownerId).to.exist.and.be.a('string');
      expect(createdItem?.listId).to.exist.and.be.a('string');
      expect(createdItem?.status).to.exist.and.be.a('string');
    });
  });

  describe('Testing list item delete', () => {
    it('endpoint should return status code UNAUTHORIZED for invalid token', async () => {
      const response = await httpClient.delete(
        replacePathParameters(requests.deleteListItem.endpoint, { listId: requests.createList.output.id, itemId: requests.createListItem.output.id }),
        { headers: invalidHeaders },
      );

      expect(response.status).to.be.equal(401);
    });

    it('endpoint should return status code NO_CONTENT for valid request', async () => {
      const response = await httpClient.delete(
        replacePathParameters(requests.deleteListItem.endpoint, { listId: requests.createList.output.id, itemId: requests.createListItem.output.id }),
        requests.deleteListItem.input,
      );

      requests.deleteListItem.output = response.data.data;

      expect(response.status).to.be.equal(204);
    });
  });
});
