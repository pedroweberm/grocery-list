const glob = require('glob')

module.exports = async ({ resolveVariable }) => {
  const infrastructureFiles = glob.sync('./src/**/*.yml');

  const resolvedInfrastructure = await Promise.all(
    infrastructureFiles.map(fileName => {
      return resolveVariable(`file(${fileName})`);
    }),
  );

  const resources = resolvedInfrastructure.reduce((acc, elem) => {
    if (elem.resources !== undefined) {
      return {
        ...acc,
        ...elem.resources,
      };
    }
    return acc;
  }, {});

  return resources
};
