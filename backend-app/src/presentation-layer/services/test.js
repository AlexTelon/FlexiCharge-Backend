const AWS = require("aws-sdk");
const cognito = new AWS.CognitoIdentityServiceProvider();

// userId - our user record index key
// email - the new user's email address
// password - the new user's password
function createCognitoUser(userId, email, password) {
    let params = {
        UserPoolId: USER_POOL_ID, // From Cognito dashboard 'Pool Id'
        Username: userId,
        MessageAction: "SUPPRESS", // Do not send welcome email
        TemporaryPassword: password,
        UserAttributes: [
            {
                Name: "email",
                Value: email
            },
            {
                // Don't verify email addresses
                Name: "email_verified",
                Value: "true"
            }
        ]
    };

    return cognito
        .adminCreateUser(params)
        .promise()
        .then(data => {
            // We created the user above, but the password is marked as temporary.
            // We need to set the password again. Initiate an auth challenge to get
            // started.
            let params = {
                AuthFlow: "ADMIN_NO_SRP_AUTH",
                ClientId: USER_POOL_CLIENT_ID, // From Cognito dashboard, generated app client id
                UserPoolId: USER_POOL_ID,
                AuthParameters: {
                    USERNAME: userId,
                    PASSWORD: password
                }
            };
            return cognito.adminInitiateAuth(params).promise();
        })
        .then(data => {
            // We now have a proper challenge, set the password permanently.
            let challengeResponseData = {
                USERNAME: userId,
                NEW_PASSWORD: password
            };

            let params = {
                ChallengeName: "NEW_PASSWORD_REQUIRED",
                ClientId: USER_POOL_CLIENT_ID,
                UserPoolId: USER_POOL_ID,
                ChallengeResponses: challengeResponseData,
                Session: data.Session
            };
            return cognito.adminRespondToAuthChallenge(params).promise();
        })
        .catch(console.error);
}

