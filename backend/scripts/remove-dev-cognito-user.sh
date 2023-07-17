USER_POOL_ID=$1
REGION=$2
USERNAME=$3

echo "USER_POOL_ID: $USER_POOL_ID";
echo "REGION: $REGION";
echo "USERNAME: $USERNAME";

DELETE_USER_RESPONSE=$(aws cognito-idp admin-delete-user \
--profile grocery-list-dev \
--region $REGION \
--user-pool-id $USER_POOL_ID \
--username $USERNAME)

echo $DELETE_USER_RESPONSE