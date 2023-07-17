# grocery-list

Grocery list application that allows creating, managing and sharing grocery lists with real time experience

# Solution

The file containing the solution diagram can be found inside the `docs` folder (grocery-list.drawio) and opened using diagrams.net.

# Configuration (backend)

## Requirements

- [Node.js](https://nodejs.org/en) (tested with version 18)
- [AWS CLI](https://docs.aws.amazon.com/cli/index.html)
- AWS credentials for an IAM user with all necessary permissions

## Set up cloud development environment

Localstack Community (free version) does not support all AWS services and features. Also, even for the resources that are supported, it does not 100% replicate the behaviours and constraints of the actual AWS cloud. For this reason, sometimes it is better to validate you implementation by deploying actual resources to the cloud during development. This section describes how you can do that for this project.

1. Navigate to backend folder:

```console
john.doe@grocery-list:~$ cd backend
```

2. Install project depencencies:

```console
john.doe@grocery-list/backend:~$ npm install
```

3. Setup aws credentials for profile `grocery-list-dev` using Serverless Framework:

```console
john.doe@grocery-list/backend:~$ npx serverless config credentials \
          --provider aws \
          --key $AWS_ACCESS_KEY_ID \
          --secret $AWS_SECRET_ACCESS_KEY \
          --profile grocery-list-dev \
          --overwrite
```

4. Run `npm run deploy:dev` to deploy the resources to the cloud using Serverless Framework:

```console
john.doe@grocery-list/backend:~$ npm run deploy:dev
```

5. Create cognito user for testing:
```console
john.doe@grocery-list/backend:~$ bash scripts/create-dev-cognito-user \
            $YOUR_USER_POOL_ID \
            $YOUR_USER_POOL_CLIENT_ID \
            $YOUR_AWS_REGION \
            $YOUR_USERNAME \
            $YOUR_TEST_EMAIL \
            $YOUR_TEST_PHONE_NUMBER \
            $YOUR_NAME
```

6. After you finish your development session, run `npm run remove:dev`. This will destroy all the resources that were created during your development session:

```console
john.doe@grocery-list/backend:~$ npm run remove:dev
```

## Set up local development environment (pointing to cloud dev environment)

1. Create a local environment file following the example env in the project. Copy/paste `.env.example.json`, rename to `.env.local.json` and fill in the required values (use outputs from deploy:dev command).
   <br />

2. Install project depencencies:

```console
john.doe@grocery-list/backend:~$ npm install
```

3. Setup aws credentials for default profile using Serverless Framework:

```console
john.doe@grocery-list/backend:~$ npx serverless config credentials \
          --provider aws \
          --key $AWS_ACCESS_KEY_ID \
          --secret $AWS_SECRET_ACCESS_KEY \
          --overwrite
```

4. Start project locally:
```console
john.doe@grocery-list/backend:~$ npm run local
```

Obs.: Most of the endpoints will not work properly on local mode because serverless-offline plugin does not support cognito authorizers

## Setup CI/CD pipeline on Github
This project has 2 configured workflows, `backend-ci` and `backend-cd`. The CI script runs on every pull request to `develop`, `testing` or `master` branches. It validates code linting, runs unit tests and integration tests. For the integration tests, the workflow creates a temporary environment (using the PR number as a prefix), runs the tests on this environment and then destroys it. The CD script deploys the changes to the corresponding environment (`testing` branch -> testing environment, `master` branch -> production environment). To set it up, all you need to do is to add your aws credentials to your repository recrets (`AWS_ACCESS_KEY_ID` and `AWS_SECRET_ACCESS_KEY`).

## Running integration tests locally
You can also run the integration tests locally pointing to the cloud dev environment.
```console
john.doe@grocery-list/backend:~$ env \
            AWS_ACCESS_KEY_ID=$YOUR_AWS_ACCESS_KEY_ID \
            AWS_SECRET_ACCESS_KEY=$YOUR_AWS_SECRET_ACCESS_KEY \
            STAGE_NAME=dev \
            npm run test:integration
```

## Running the frontend application
To be able to better visualize the backend in action, you can run the frontend application locally poiting one of the cloud environments (`dev`, `testing` or `production`):

1. Navigate to frontend folder:
```console
john.doe@grocery-list:~$ cd frontend
```

2. Install project dependencies:
```console
john.doe@grocery-list/frontend:~$ npm install
```

3. Create a local environment file following the example env in the project. Copy/paste `.env.example`, rename to `.env.local` and fill in the required values (use outputs from backend deployment).
   <br />

4. Start the project:
```console
john.doe@grocery-list/frontend:~$ npm run dev
```