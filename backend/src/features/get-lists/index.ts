import { DynamoDBClient } from '@aws-sdk/client-dynamodb';

import { DynamoDBClientFactory } from '@clients/dynamodb';
import { LoggerFactory } from '@clients/logger';
import { config } from '@src/config';

import { GetListsRepositoryFactory } from './get-lists.repository';
import { GetListsUsecaseFactory } from './get-lists.usecase';
import { GetListsControllerFactory } from './get-lists.controller';
import { GetListsHandlerFactory } from './get-lists.handler';

const logger = LoggerFactory(config.serviceName, config.activeEnv);
const dynamoDbClient = DynamoDBClientFactory(new DynamoDBClient({}), logger);

const repository = GetListsRepositoryFactory(dynamoDbClient);
const usecase = GetListsUsecaseFactory(repository);
const controller = GetListsControllerFactory(usecase, logger);

export const { handler } = GetListsHandlerFactory(controller, logger);
