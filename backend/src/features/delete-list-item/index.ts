import { DynamoDBClient } from '@aws-sdk/client-dynamodb';

import { DynamoDBClientFactory } from '@clients/dynamodb';
import { LoggerFactory } from '@clients/logger';
import { config } from '@src/config';

import { DeleteListItemRepositoryFactory } from './delete-list-item.repository';
import { DeleteListItemUsecaseFactory } from './delete-list-item.usecase';
import { DeleteListItemControllerFactory } from './delete-list-item.controller';
import { DeleteListItemHandlerFactory } from './delete-list-item.handler';

const logger = LoggerFactory(config.serviceName, config.activeEnv);
const dynamoDbClient = DynamoDBClientFactory(new DynamoDBClient({}), logger);

const repository = DeleteListItemRepositoryFactory(dynamoDbClient);
const usecase = DeleteListItemUsecaseFactory(repository);
const controller = DeleteListItemControllerFactory(usecase, logger);

export const { handler } = DeleteListItemHandlerFactory(controller, logger);
