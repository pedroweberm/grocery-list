const envVariables = require('../.env.example.json');

const getEnvValuesFromFile = async runningStage => {
  const variables = require(`../.env.${runningStage}.json`);

  return variables;
};

const validateVariables = loadedVariables => {
  const exampleEnvVariables = Object.keys(envVariables);

  exampleEnvVariables.forEach(variableName => {
    const value = loadedVariables[variableName];

    if (!value || value.length === 0) {
      throw new Error(`Variable ${variableName} is missing (defined in .env.example.json)`);
    }
  });
};

const getStageName = (rawName) => {
  if (rawName.includes('pr-')) return 'pr'

  return rawName
}

module.exports = async ({ resolveVariable }) => {
  const rawStage = await resolveVariable('self:provider.stage');

  const stage = getStageName(rawStage)

  console.log(`Resolving environment variables for '${stage}' stage...`);

  switch (stage) {
    case 'local': {
      const variablesFromFile = await getEnvValuesFromFile(stage);

      validateVariables(variablesFromFile);

      return variablesFromFile;
    }
    case 'dev': {
      const variablesFromFile = await getEnvValuesFromFile(stage);
      const customVariables = {
        DYNAMODB_TABLE_NAME: { Ref: 'GroceryListTable' },
        COGNITO_USER_POOL_ID: { Ref: 'GroceryListCognitoUserPool' },
        IOT_CONNECTOR_ROLE_ARN: { 'Fn::GetAtt': ['IotConnectorRole', 'Arn'] },
        IOT_DATA_ENDPOINT: await resolveVariable('file(./resolvers/get-iot-endpoint.js):endpoint'),
      };
      const variables = {
        ...variablesFromFile,
        ...customVariables,
      };

      validateVariables(variables);

      return variables;
    }
    case 'pr': {
      const variablesFromFile = await getEnvValuesFromFile(stage);
      const customVariables = {
        DYNAMODB_TABLE_NAME: { Ref: 'GroceryListTable' },
        COGNITO_USER_POOL_ID: { Ref: 'GroceryListCognitoUserPool' },
        IOT_CONNECTOR_ROLE_ARN: { 'Fn::GetAtt': ['IotConnectorRole', 'Arn'] },
        IOT_DATA_ENDPOINT: await resolveVariable('file(./resolvers/get-iot-endpoint.js):endpoint'),
      };
      const variables = {
        ...variablesFromFile,
        ...customVariables,
      };

      validateVariables(variables);

      return variables;
    }
    case 'testing': {
      const variablesFromFile = await getEnvValuesFromFile(stage);
      const customVariables = {
        DYNAMODB_TABLE_NAME: { Ref: 'GroceryListTable' },
        COGNITO_USER_POOL_ID: { Ref: 'GroceryListCognitoUserPool' },
        IOT_CONNECTOR_ROLE_ARN: { 'Fn::GetAtt': ['IotConnectorRole', 'Arn'] },
        IOT_DATA_ENDPOINT: await resolveVariable('file(./resolvers/get-iot-endpoint.js):endpoint'),
      };
      const variables = {
        ...variablesFromFile,
        ...customVariables,
      };

      validateVariables(variables);

      return variables;
    }
    case 'production': {
      const variablesFromFile = await getEnvValuesFromFile(stage);
      const customVariables = {
        DYNAMODB_TABLE_NAME: { Ref: 'GroceryListTable' },
        COGNITO_USER_POOL_ID: { Ref: 'GroceryListCognitoUserPool' },
        IOT_CONNECTOR_ROLE_ARN: { 'Fn::GetAtt': ['IotConnectorRole', 'Arn'] },
        IOT_DATA_ENDPOINT: await resolveVariable('file(./resolvers/get-iot-endpoint.js):endpoint'),
      };
      const variables = {
        ...variablesFromFile,
        ...customVariables,
      };

      validateVariables(variables);

      return variables;
    }
    default:
      return envVariables;
  }
};
