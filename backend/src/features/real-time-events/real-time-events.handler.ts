import type { APIGatewayEvent } from 'aws-lambda';
import { STSClient, AssumeRoleCommand } from '@aws-sdk/client-sts';
import { v4 as uuid } from 'uuid';
import { SignatureV4 } from '@aws-sdk/signature-v4';
import { Sha256 } from '@aws-crypto/sha256-js';
import { HttpRequest } from '@aws-sdk/protocol-http';
import { formatUrl } from '@aws-sdk/util-format-url';

import { config } from '@src/config';

const createPresignedURL = async ({
  accessKeyId,
  secretAccessKey,
  sessionToken,
  host,
  region,
  method,
  protocol,
  path,
  service,
  expirationTime,
}: {
  accessKeyId: string;
  secretAccessKey: string;
  sessionToken: string;
  host: string;
  region: string;
  method: string;
  protocol: string;
  path: string;
  service: string;
  expirationTime: number;
}) => {
  const signer = new SignatureV4({
    credentials: { accessKeyId, secretAccessKey, sessionToken: undefined },
    region,
    service,
    sha256: Sha256,
  });
  const req = new HttpRequest({
    protocol,
    hostname: host,
    path,
    method,
    headers: { host },
  });
  const signedRequest = await signer.presign(req, { expiresIn: expirationTime });

  if (typeof sessionToken === 'string' && typeof signedRequest.query === 'object') {
    signedRequest.query['X-Amz-Security-Token'] = sessionToken;
  }

  return formatUrl(signedRequest);
};

export const RealTimeEventsHandlerFactory = () => {
  const handler = async (_event: APIGatewayEvent) => {
    const response = await new STSClient({}).send(
      new AssumeRoleCommand({
        RoleArn: config.iotConnectorRoleArn,
        RoleSessionName: `presigned-url-session-${uuid()}`,
        DurationSeconds: 60 * 60,
      }),
    );

    const iotConnectorAccessKeyId = response.Credentials?.AccessKeyId ?? '';
    const iotConnectorSecretAccessKey = response.Credentials?.SecretAccessKey ?? '';
    const iotConnectorSessionToken = response.Credentials?.SessionToken ?? '';

    const url = await createPresignedURL({
      accessKeyId: iotConnectorAccessKeyId,
      secretAccessKey: iotConnectorSecretAccessKey,
      sessionToken: iotConnectorSessionToken,
      host: config.iotDataEndpoint,
      region: config.awsRegion,
      method: 'GET',
      protocol: 'wss',
      path: '/mqtt',
      service: 'iotdevicegateway',
      expirationTime: 60 * 60,
    });

    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true,
      },
      body: JSON.stringify({
        success: true,
        message: 'Pre-signed url generated successfully',
        data: { url },
      }),
    };
  };

  return { handler };
};
