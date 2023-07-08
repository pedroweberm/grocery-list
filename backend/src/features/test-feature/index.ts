const handler = async () => {
  console.log('test change');

  return {
    statusCode: 200,
    body: JSON.stringify({ success: true, message: 'Hello world!' }),
  };
};

export { handler };
