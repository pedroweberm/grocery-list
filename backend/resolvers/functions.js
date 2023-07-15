const glob = require('glob')

module.exports = async ({ resolveVariable }) => {
  const infrastructureFiles = glob.sync('./src/**/*.yml');

  const resolvedInfrastructure = await Promise.all(
    infrastructureFiles.map(fileName => {
      return resolveVariable(`file(${fileName})`);
    }),
  );

  const functions = resolvedInfrastructure.reduce((acc, elem) => {
    if (elem.functions !== undefined) {
      return {
        ...acc,
        ...elem.functions,
      };
    }
    return acc;
  }, {});

  return functions
};
