import type { AttributeValue } from 'aws-lambda';

export const attributeMapToObject = <T extends { [key: string]: unknown }>(attributeMap: { [key: string]: AttributeValue }): T =>
  Object.entries(attributeMap).reduce((acc, [key, value]) => {
    return { ...acc, [key]: Object.values(value)[0] };
  }, {} as T);

export const objectToUpdateExpression = (attributes: { [key: string]: string | undefined }) =>
  Object.entries(attributes)
    .reduce((acc, [key, value]) => {
      return value ? `${acc} ${key}=:${key},` : acc;
    }, 'set')
    .slice(0, -1);

export const objectToUpdateExpressionAttributeValues = (attributes: { [key: string]: string | undefined }) =>
  Object.entries(attributes).reduce((acc, [key, value]) => {
    return value ? { ...acc, [`:${key}`]: value } : acc;
  }, {});
