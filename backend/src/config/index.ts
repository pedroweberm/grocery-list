const config = {
  activeEnv: process.env.NODE_ENV || 'dev',
  serviceName: 'grocery-list-backend',
  awsRegion: process.env.AWS_REGION || 'us-east-1',
  dynamoDBTableName: String(process.env.DYNAMODB_TABLE_NAME),
  cognitoUserPoolId: String(process.env.COGNITO_USER_POOL_ID),
};

export { config };
