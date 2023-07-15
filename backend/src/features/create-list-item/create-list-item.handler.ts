import type { LogClient } from '@clients/logger';
import { APIGatewayEvent } from 'aws-lambda';

import { CreateListItemController } from './create-list-item.controller';

export function CreateListItemHandlerFactory(controller: CreateListItemController, logger: LogClient) {
  const handler = async (event: APIGatewayEvent) => {
    const requestId = event?.headers?.['requestId'];
    if (requestId) {
      logger.setRequestId(requestId);
    }

    const data = {
      ...JSON.parse(event?.body || '{}'),
      ...(event?.pathParameters || {}),
      userId: event.requestContext.authorizer?.claims.sub,
    };

    const response = await controller.createListItem(data);

    return {
      statusCode: response.status,
      body: JSON.stringify(response.body ?? {}),
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true,
      },
    };
  };

  return { handler };
}
