const envVariables = require('../.env.example.json')

module.exports = async ({ resolveVariable }) => {
  const getEnvValuesFromFile = async (runningStage) => {
    const variables = require(`../.env.${runningStage}.json`)

    return variables
  }

  const validateVariables = (loadedVariables) => {
    const exampleEnvVariables = Object.keys(envVariables)

    exampleEnvVariables.forEach((variableName) => {
      const value = loadedVariables[variableName]

      if (!value || value.length === 0) {
        throw new Error(`Variable ${variableName} is missing (defined in .env.example.json)`)
      }
    })
  }

  const stage = await resolveVariable('self:provider.stage');

  console.log(`Resolving environment variables for '${stage}' stage...`);

  switch (stage) {
    case 'local': {
      const variablesFromFile = await getEnvValuesFromFile(stage)

      validateVariables(variablesFromFile)

      return variablesFromFile;
    }
    case 'dev': {
      const variablesFromFile = await getEnvValuesFromFile(stage)
      const customVariables = {
        "DYNAMODB_TABLE_NAME": { Ref: 'GroceryListTable' },
        "COGNITO_USER_POOL_ID": { Ref: 'GroceryListCognitoUserPool' }
      }
      const variables = {
        ...variablesFromFile,
        ...customVariables
      }

      validateVariables(variables)

      return variables;
    }
    case 'testing': 
      return envVariables;
    case 'production': 
      return envVariables;
    default:
      return envVariables;
  }
};
