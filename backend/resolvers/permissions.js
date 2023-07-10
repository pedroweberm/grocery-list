module.exports = async () => {
  return {
    statements: [
      {
        Effect: 'Allow',
        Action: ['dynamodb:PutItem', 'dynamodb:Query', 'dynamodb:UpdateItem', 'dynamodb:DeleteItem'],
        Resource: {
          'Fn::GetAtt': ['GroceryListTable', 'Arn'],
        },
      },
      {
        Effect: 'Allow',
        Action: ['dynamodb:PutItem', 'dynamodb:Query', 'dynamodb:UpdateItem', 'dynamodb:DeleteItem'],
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
      {
        Effect: 'Allow',
        Action: ['cognito-idp:AdminGetUser'],
        Resource: {
          'Fn::GetAtt': ['GroceryListCognitoUserPool', 'Arn']
        }
      }
    ],
  };
};
