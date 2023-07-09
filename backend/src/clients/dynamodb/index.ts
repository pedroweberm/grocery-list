import type { DynamoDBDocumentClient, PutCommandInput } from '@aws-sdk/lib-dynamodb';
import { PutCommand } from '@aws-sdk/lib-dynamodb';

import type { LogClient } from '@clients/logger';

export type DynamoDBClient = ReturnType<typeof DynamoDBClientFactory>;

export function DynamoDBClientFactory(documentClient: DynamoDBDocumentClient, logger: LogClient) {
  async function put(params: PutCommandInput) {
    logger.info(`[DynamoDBClient][Start] put(${params.TableName}, ${params?.Item?.partition_key}, ${params?.Item?.sort_key})`);
    logger.start(`[DynamoDBClient] put(${params.TableName}, ${params?.Item?.partition_key}, ${params?.Item?.sort_key})`);
    const command = new PutCommand(params);
    const response = await documentClient.send(command);
    logger.end(`[DynamoDBClient] put(${params.TableName}, ${params?.Item?.partition_key}, ${params?.Item?.sort_key})`);
    logger.info(`[DynamoDBClient][End] put(${params.TableName}, ${params?.Item?.partition_key}, ${params?.Item?.sort_key})`);

    return response;
  }

  return {
    put,
  };
}
