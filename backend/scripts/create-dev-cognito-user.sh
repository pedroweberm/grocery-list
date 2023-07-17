USER_POOL_ID=$1
USER_POOL_CLIENT_ID=$2
REGION=$3
USERNAME=$4
EMAIL=$5
PHONE_NUMBER=$6
NAME=$7

echo "USER_POOL_ID: $USER_POOL_ID";
echo "USER_POOL_CLIENT_ID: $USER_POOL_CLIENT_ID";
echo "REGION: $REGION";
echo "USERNAME: $USERNAME";
echo "EMAIL: $EMAIL";
echo "PHONE_NUMBER: $PHONE_NUMBER";
echo "NAME: $NAME";

CREATE_USER_RESPONSE=$(aws cognito-idp admin-create-user \
--profile grocery-list-dev \
--region $REGION \
--user-pool-id $USER_POOL_ID \
--username $USERNAME \
--temporary-password PassW0rd! \
--message-action SUPPRESS \
--user-attributes Name=email_verified,Value=True Name=email,Value=$EMAIL Name=phone_number,Value=$PHONE_NUMBER Name=preferred_username,Value=$USERNAME Name=name,Value=$NAME)

INITIATE_AUTH_RESPONSE=$(aws cognito-idp admin-initiate-auth \
--profile grocery-list-dev \
--region $REGION \
--user-pool-id $USER_POOL_ID \
--client-id $USER_POOL_CLIENT_ID \
--auth-flow ADMIN_NO_SRP_AUTH \
--auth-parameters USERNAME=$USERNAME,PASSWORD=PassW0rd!)

challenge_name=$(echo $INITIATE_AUTH_RESPONSE | jq -r '.ChallengeName')
session=$(echo $INITIATE_AUTH_RESPONSE | jq -r '.Session')
user_id=$(echo $INITIATE_AUTH_RESPONSE | jq -r '.ChallengeParameters.USER_ID_FOR_SRP')

RESPOND_TO_CHALLENGE_RESPONSE=$(aws cognito-idp admin-respond-to-auth-challenge \
--profile grocery-list-dev \
--region $REGION \
--user-pool-id $USER_POOL_ID \
--client-id $USER_POOL_CLIENT_ID \
--challenge-name $challenge_name \
--session $session \
--challenge-responses USERNAME=$user_id,NEW_PASSWORD=Fin4lP4ssword!)

echo Token is: $(echo $RESPOND_TO_CHALLENGE_RESPONSE | jq -r '.AuthenticationResult.IdToken')