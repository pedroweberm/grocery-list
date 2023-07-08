const handler = async () => {
  return {
    statusCode: 200,
    body: JSON.stringify({ success: true, message: 'Hello world!' }),
  };
};

export { handler };
