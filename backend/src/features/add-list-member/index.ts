import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { CognitoIdentityProviderClient } from '@aws-sdk/client-cognito-identity-provider';

import { DynamoDBClientFactory } from '@clients/dynamodb';
import { CognitoClientFactory } from '@clients/cognito';
import { LoggerFactory } from '@clients/logger';
import { config } from '@src/config';

import { AddListMemberRepositoryFactory } from './add-list-member.repository';
import { AddListMemberUsecaseFactory } from './add-list-member.usecase';
import { AddListMemberControllerFactory } from './add-list-member.controller';
import { AddListMemberHandlerFactory } from './add-list-member.handler';

const logger = LoggerFactory(config.serviceName, config.activeEnv);
const dynamoDbClient = DynamoDBClientFactory(new DynamoDBClient({}), logger);
const cognitoClient = CognitoClientFactory(new CognitoIdentityProviderClient({}), logger);

const repository = AddListMemberRepositoryFactory(dynamoDbClient, cognitoClient);
const usecase = AddListMemberUsecaseFactory(repository);
const controller = AddListMemberControllerFactory(usecase, logger);

export const { handler } = AddListMemberHandlerFactory(controller, logger);
