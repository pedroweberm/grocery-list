const envVariables = require('../.env.example.json')

module.exports = async ({ resolveVariable }) => {
  const getEnvValuesFromFile = async (runningStage, variableNames) => {
    const resolvedVariables = await Promise.all(variableNames.map(async (variableName) => {
      const resolvedValue = await resolveVariable(`file(./.env.${runningStage}.json):${variableName}`)

      return [variableName, resolvedValue]
    }))

    return resolvedVariables.reduce((acc, [name, value]) => ({ ...acc, [name]: value }), {})
  }

  const stage = await resolveVariable('self:provider.stage');

  console.log(`Resolving environment variables for '${stage}' stage...\
  \nIf you get the 'Cannot resolve variable at "custom.variables": Value not found at "file" source'\
  it means you are missing some variables in your .env.${stage}.json file`);

  switch (stage) {
    case 'dev': {
      const variables = await getEnvValuesFromFile(stage, Object.keys(envVariables))

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
