const handler = async () => {
  console.log('Hello world');

  return {
    statusCode: 200,
    body: JSON.stringify({ success: true, message: 'Hello world!' }),
  };
};

export { handler };
