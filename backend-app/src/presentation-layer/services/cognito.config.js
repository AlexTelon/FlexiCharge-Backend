const AWS = require('aws-sdk')
// // const crypto = require('crypto-js')
// const sha256 = require('crypto-js/sha256');
// const hmac = require('crypto-js/hmac-sha256');

AWS.config.getCredentials(function (err) {
    console.log(1337);
    if (err) console.log(err.stack);
    // credentials not loaded
    else {
        console.log("Access key:", AWS.config.credentials.accessKeyId);
    }
});

const { createHmac } = require('crypto')
const AuthMiddleware = require('../middleware/auth.middleware')
const auth = new AuthMiddleware();



// const authError = {
//     message: 'The user is not authorized for this content.',
//     code: 'UserNotAuthorizedException',
//     statusCode: '403'
// }

class CognitoService {

    config = {
        region: 'eu-west-1',
        // accessKeyId: process.env.AWS_SECRET_KEY,
        // secretAccessKey: process.env.AWS_SECRET_KEY,
    }

    cognitoIdentity;
    secretHash = '17dlkm3vvufapqf8cv4p3252j3m4j4rd6t69bo5jc1kheqovcoui'
    clientId = '2ng9ud2h1cd4het746tcldvlh2'

    constructor() {
        this.cognitoIdentity = new AWS.CognitoIdentityServiceProvider(this.config);
    }

    async signUpUser(username, password, userAttributes) {

        const params = {
            Username: username,
            Password: password,
            ClientId: this.clientId,
            SecretHash: this.generateHash(username),
            UserAttributes: userAttributes
        }
        try {
            const data = await this.cognitoIdentity.signUp(params).promise();
            return true
        } catch (error) {
            return error
        }
    }

    async verifyAccount(username, code) {
        const params = {
            ClientId: this.clientId,
            ConfirmationCode: code,
            SecretHash: this.generateHash(username),
            Username: username,
        };

        try {
            const data = await this.cognitoIdentity.confirmSignUp(params).promise();
            return true
        } catch (error) {
            return error
        }
    }


    // async signInAdmin(username, password) {

    //     const params = {
    //         AuthFlow: 'USER_PASSWORD_AUTH',
    //         ClientId: this.clientId,
    //         UserPoolId: this.userPoolId,
    //         AuthParameters: {
    //             'USERNAME': username,
    //             'PASSWORD': password,
    //             'SECRET_HASH': this.generateHash(username)
    //         }
    //     }
    //     try {

    //         const tokens = await this.cognitoIdentity.initiateAuth(params).promise();
    //         const payload = await auth.decodeToken(tokens.AuthenticationResult.IdToken);

    //         console.log('Hello');
    //         console.log(tokens);
    //         console.log(payload);

    //         if (payload['cognito:groups'] === undefined) {
    //             return authError
    //         } else if (payload['cognito:groups'].includes('Admin')) {
    //             const data = {
    //                 accessToken: tokens.AuthenticationResult.AccessToken,
    //                 email: payload.email,
    //                 username: payload['cognito:username'],
    //                 name: payload.name,
    //                 family_name: payload.family_name,
    //                 user_id: payload.sub
    //             }
    //             return data
    //         } else {
    //             return authError
    //         }

    //     } catch (error) {
    //         console.log(error);
    //         return error
    //     }
    // }

    async signInUser(username, password) {
        const params = {
            AuthFlow: 'USER_PASSWORD_AUTH',
            ClientId: this.clientId,
            AuthParameters: {
                'USERNAME': username,
                'PASSWORD': password,
                'SECRET_HASH': this.generateHash(username)
            }
        }
        try {

            const tokens = await this.cognitoIdentity.initiateAuth(params).promise();
            const userdata = await auth.decodeToken(tokens.AuthenticationResult.IdToken);

            const data = {
                accessToken: tokens.AuthenticationResult.AccessToken,
                email: userdata.email,
                username: userdata['cognito:username'],
                name: userdata.name,
                family_name: userdata.family_name,
                user_id: userdata.sub
            }

            return data

        } catch (error) {
            console.log(error);
            return error
        }
    }

    generateHash(username) {
        return createHmac('SHA256', this.secretHash)
            .update(username + this.clientId)
            .digest("base64");
    }


    async createCognitoUser(username, password) {
        let params = {
            UserPoolId: this.userPoolId, // From Cognito dashboard 'Pool Id'
            Username: username,
            MessageAction: "SUPPRESS", // Do not send welcome email
            TemporaryPassword: password,
            UserAttributes: [
                {
                    Name: "email",
                    Value: "filip.lundh11@gmail.com"
                },
                {
                    // Don't verify email addresses
                    Name: "email_verified",
                    Value: "true"
                }
            ]
        };

        const res = await this.cognitoIdentity.adminCreateUser(params).promise()
            .catch(err => console.log(err))

        console.log(res);

        // let params = {
        //     AuthFlow: "ADMIN_NO_SRP_AUTH",
        //     ClientId: USER_POOL_CLIENT_ID, // From Cognito dashboard, generated app client id
        //     UserPoolId: USER_POOL_ID,
        //     AuthParameters: {
        //         USERNAME: userId,
        //         PASSWORD: password
        //     }
        // };

    }




}

module.exports = CognitoService
