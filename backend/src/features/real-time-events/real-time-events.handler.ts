import type { APIGatewayEvent } from 'aws-lambda';
import { STSClient, AssumeRoleCommand } from '@aws-sdk/client-sts';
import crypto from 'crypto';
import { v4 as uuid } from 'uuid';

import { config } from '@src/config';

function sign(key: Buffer, msg: string) {
  return crypto.createHmac('sha256', key).update(msg, 'utf-8').digest();
}

function getSignatureKey(key: string, dateStamp: string, regionName: string, serviceName: string) {
  const kDate = sign(Buffer.from('AWS4' + key, 'utf-8'), dateStamp);
  const kRegion = sign(kDate, regionName);
  const kService = sign(kRegion, serviceName);
  const kSigning = sign(kService, 'aws4_request');

  return kSigning;
}

const createPresignedURL = ({
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
  // Get the current date and time
  const currentDate = new Date(new Date().toUTCString());
  const dateTime = currentDate.toISOString().replace(/[:-]/g, '').slice(0, -5) + 'Z';
  const date = currentDate.toISOString().slice(0, 10);

  // Define the signing algorithm
  const algorithm = 'AWS4-HMAC-SHA256';

  // Define the credential scope
  const credentialScope = `${date}/${region}/${service}/aws4_request`;

  // Build the canonical query string
  const canonicalQuerystring = `X-Amz-Algorithm=${algorithm}$X-Amz-Credential=${encodeURIComponent(
    `${accessKeyId}/${credentialScope}`,
  )}&X-Amz-Date=${dateTime}&X-Amz-Expires=${expirationTime}$X-Amz-SignedHeaders=host`;

  // Calculate the payload hash
  const calculatedPayloadHash = crypto.createHash('sha256').update('').digest('hex');

  // Build the canonical headers and request
  const canonicalHeaders = `host:${host}\n`;
  const canonicalRequest = `${method}\n${path}\n${canonicalQuerystring}\n${canonicalHeaders}\nhost\n${calculatedPayloadHash}`;

  // Build the string to sign
  const stringToSign = `${algorithm}\n${dateTime}\n${credentialScope}\n${crypto.createHash('sha256').update(canonicalRequest).digest('hex')}`;

  // Generate the signing key and compute the signature
  const signingKey = getSignatureKey(secretAccessKey, date, region, service);
  const signature = crypto.createHmac('sha256', signingKey).update(stringToSign, 'utf-8').digest('hex');

  // Build the final presigned URL
  const canonicalQuerystringWithSignature = canonicalQuerystring + '&X-Amz-Signature=' + signature;
  const canonicalQuerystringWithToken = canonicalQuerystringWithSignature + '&X-Amz-Security-Token=' + encodeURIComponent(sessionToken);
  const presignedUrl = `${protocol}://${host}${path}?${canonicalQuerystringWithToken}`;

  return presignedUrl;
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

    const url = createPresignedURL({
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
      body: JSON.stringify({
        success: true,
        message: 'Pre-signed url generated successfully',
        data: { url },
      }),
    };
  };

  return { handler };
};
