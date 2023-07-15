import { DynamoDBClient } from '@aws-sdk/client-dynamodb';

import { DynamoDBClientFactory } from '@clients/dynamodb';
import { LoggerFactory } from '@clients/logger';
import { config } from '@src/config';

import { UpdateListItemRepositoryFactory } from './update-list-item.repository';
import { UpdateListItemUsecaseFactory } from './update-list-item.usecase';
import { UpdateListItemControllerFactory } from './update-list-item.controller';
import { UpdateListItemHandlerFactory } from './update-list-item.handler';

const logger = LoggerFactory(config.serviceName, config.activeEnv);
const dynamoDbClient = DynamoDBClientFactory(new DynamoDBClient({}), logger);

const repository = UpdateListItemRepositoryFactory(dynamoDbClient);
const usecase = UpdateListItemUsecaseFactory(repository);
const controller = UpdateListItemControllerFactory(usecase, logger);

export const { handler } = UpdateListItemHandlerFactory(controller, logger);
