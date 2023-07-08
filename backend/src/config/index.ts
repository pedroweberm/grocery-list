const config = {
  activeEnv: process.env.NODE_ENV || 'dev',
  serviceName: 'grocery-list-backend',
  exampleVariable: process.env.EXAMPLE_ENV,
  awsRegion: process.env.AWS_REGION || 'us-east-1',
};

export { config };
