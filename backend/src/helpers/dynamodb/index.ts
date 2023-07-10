export const attributeMapToObject = (attributeMap: { [key: string]: { [key: string]: string } }) =>
  Object.entries(attributeMap).reduce((acc, [key, value]) => {
    return { ...acc, [key]: Object.values(value)[0] };
  }, {});
