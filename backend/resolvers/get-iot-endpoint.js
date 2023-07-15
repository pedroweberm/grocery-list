const { IoTClient, DescribeEndpointCommand } = require('@aws-sdk/client-iot');

module.exports = async ({ resolveVariable }) => {
  const region = await resolveVariable('self:provider.region');

  const response = await new IoTClient({
    region,
  }).send(new DescribeEndpointCommand({ endpointType: 'iot:Data-ATS' }));

  return { endpoint: response.endpointAddress };
};
