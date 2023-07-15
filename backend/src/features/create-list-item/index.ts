import { DynamoDBClient } from '@aws-sdk/client-dynamodb';

import { DynamoDBClientFactory } from '@clients/dynamodb';
import { LoggerFactory } from '@clients/logger';
import { config } from '@src/config';

import { CreateListItemRepositoryFactory } from './create-list-item.repository';
import { CreateListItemUsecaseFactory } from './create-list-item.usecase';
import { CreateListItemControllerFactory } from './create-list-item.controller';
import { CreateListItemHandlerFactory } from './create-list-item.handler';

const logger = LoggerFactory(config.serviceName, config.activeEnv);
const dynamoDbClient = DynamoDBClientFactory(new DynamoDBClient({}), logger);

const repository = CreateListItemRepositoryFactory(dynamoDbClient);
const usecase = CreateListItemUsecaseFactory(repository);
const controller = CreateListItemControllerFactory(usecase, logger);

export const { handler } = CreateListItemHandlerFactory(controller, logger);
