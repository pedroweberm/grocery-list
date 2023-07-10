import { DynamoDBClient } from '@aws-sdk/client-dynamodb';

import { DynamoDBClientFactory } from '@clients/dynamodb';
import { LoggerFactory } from '@clients/logger';
import { config } from '@src/config';

import { CreateListItemHandlerFactory } from '@features/create-list-item/create-list-item.handler';

const logger = LoggerFactory(config.serviceName, config.activeEnv);
const dynamoDbClient = DynamoDBClientFactory(new DynamoDBClient({}), logger);

export const { handler } = CreateListItemHandlerFactory(dynamoDbClient);
