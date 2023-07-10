import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { CognitoIdentityProviderClient } from '@aws-sdk/client-cognito-identity-provider';

import { DynamoDBClientFactory } from '@clients/dynamodb';
import { CognitoClientFactory } from '@clients/cognito';
import { LoggerFactory } from '@clients/logger';
import { config } from '@src/config';

import { AddListMemberHandlerFactory } from '@features/add-list-member/add-list-member.handler';

const logger = LoggerFactory(config.serviceName, config.activeEnv);
const dynamoDbClient = DynamoDBClientFactory(new DynamoDBClient({}), logger);
const cognitoClient = CognitoClientFactory(new CognitoIdentityProviderClient({}), logger);

export const { handler } = AddListMemberHandlerFactory(dynamoDbClient, cognitoClient);
