const { IoTClient, DescribeEndpointCommand } = require('@aws-sdk/client-iot')

module.exports = async ({ resolveVariable }) => {
  const region = await resolveVariable('self:provider.region')

  const response = await new IoTClient({
    region,
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID ?? '',
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY ?? '',
    },
  }).send(new DescribeEndpointCommand({ endpointType: 'iot:Data-ATS' }))

  return { endpoint: response.endpointAddress }
};
