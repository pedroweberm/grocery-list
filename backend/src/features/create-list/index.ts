import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb';

import { DynamoDBClientFactory } from '@clients/dynamodb';
import { LoggerFactory } from '@clients/logger';
import { config } from '@src/config';

import { CreateListHandlerFactory } from '@features/create-list/create-list.handler';

const logger = LoggerFactory(config.serviceName, config.activeEnv);
const dynamoDbClient = DynamoDBClientFactory(DynamoDBDocumentClient.from(new DynamoDBClient({})), logger);

export const { handler } = CreateListHandlerFactory(dynamoDbClient);
