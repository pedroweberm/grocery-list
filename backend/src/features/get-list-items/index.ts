import { DynamoDBClient } from '@aws-sdk/client-dynamodb';

import { DynamoDBClientFactory } from '@clients/dynamodb';
import { LoggerFactory } from '@clients/logger';
import { config } from '@src/config';

import { GetListItemsRepositoryFactory } from './get-list-items.repository';
import { GetListItemsUsecaseFactory } from './get-list-items.usecase';
import { GetListItemsControllerFactory } from './get-list-items.controller';
import { GetListItemsHandlerFactory } from './get-list-items.handler';

const logger = LoggerFactory(config.serviceName, config.activeEnv);
const dynamoDbClient = DynamoDBClientFactory(new DynamoDBClient({}), logger);

const repository = GetListItemsRepositoryFactory(dynamoDbClient);
const usecase = GetListItemsUsecaseFactory(repository);
const controller = GetListItemsControllerFactory(usecase, logger);

export const { handler } = GetListItemsHandlerFactory(controller, logger);
