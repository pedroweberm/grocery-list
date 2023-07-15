import type { LogClient } from '@clients/logger';
import { APIGatewayEvent } from 'aws-lambda';

import { GetListsController } from './get-lists.controller';

export function GetListsHandlerFactory(controller: GetListsController, logger: LogClient) {
  const handler = async (event: APIGatewayEvent) => {
    const requestId = event?.headers?.['requestId'];
    if (requestId) {
      logger.setRequestId(requestId);
    }

    const data = {
      userId: event.requestContext.authorizer?.claims.sub,
    };

    const response = await controller.getListItems(data);

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
