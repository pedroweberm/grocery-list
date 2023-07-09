module.exports = async () => {
  return {
    statements: [
      {
        Effect: 'Allow',
        Action: ['dynamodb:PutItem', 'dynamodb:Query'],
        Resource: {
          'Fn::GetAtt': ['GroceryListTable', 'Arn'],
        },
      },
      {
        Effect: 'Allow',
        Action: ['dynamodb:PutItem', 'dynamodb:Query'],
        Resource: {
          'Fn::Join': [
            '',
            [
              {
                'Fn::GetAtt': ['GroceryListTable', 'Arn'],
              },
              '/index/',
              'list_members_index',
            ],
          ],
        },
      },
    ],
  };
};
