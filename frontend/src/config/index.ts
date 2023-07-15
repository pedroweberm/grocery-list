export const config = {
  awsRegion: import.meta.env.VITE_AWS_REGION,
  cognitoUserPoolId: import.meta.env.VITE_COGNITO_USER_POOL_ID,
  cognitoWebClientId: import.meta.env.VITE_COGNITO_WEB_CLIENT_ID,
  listsApiBaseUrl: import.meta.env.VITE_LISTS_API_BASE_URL,
  listsApiStage: import.meta.env.VITE_LISTS_API_STAGE
}