import type { AdminGetUserCommandInput, CognitoIdentityProviderClient } from '@aws-sdk/client-cognito-identity-provider';
import { AdminGetUserCommand } from '@aws-sdk/client-cognito-identity-provider';

import type { LogClient } from '@clients/logger';

export type CognitoClient = ReturnType<typeof CognitoClientFactory>;

export function CognitoClientFactory(cognitoClient: CognitoIdentityProviderClient, logger: LogClient) {
  async function adminGetUser(params: AdminGetUserCommandInput) {
    logger.info(`[CognitoIDPClient][Start] adminGetUser(${params.UserPoolId}, ${params.Username})`);
    logger.start(`[CognitoIDPClient] adminGetUser(${params.UserPoolId}, ${params.Username})`);
    const command = new AdminGetUserCommand(params);
    const response = await cognitoClient.send(command);
    logger.end(`[CognitoIDPClient] adminGetUser(${params.UserPoolId}, ${params.Username})`);
    logger.info(`[CognitoIDPClient][End] adminGetUser(${params.UserPoolId}, ${params.Username})`);

    return response;
  }

  return {
    adminGetUser,
  };
}
