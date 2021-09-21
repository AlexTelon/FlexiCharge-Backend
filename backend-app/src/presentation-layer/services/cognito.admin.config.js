const AWS = require('aws-sdk')
// // const crypto = require('crypto-js')
// const sha256 = require('crypto-js/sha256');
// const hmac = require('crypto-js/hmac-sha256');
const { createHmac } = require('crypto')
const AuthMiddleware = require('../middleware/auth.middleware')
const auth = new AuthMiddleware();

AWS.config.getCredentials(function (err) {
    if (err) console.log(err.stack);
    // credentials not loaded
    else {
        console.log("Access key:", AWS.config.credentials.accessKeyId);
    }
});

const authError = {
    message: 'The user is not authorized for this content.',
    code: 'UserNotAuthorizedException',
    statusCode: '403'
}

class CognitoService {

    config = {
        region: 'eu-west-1'
    }
    cognitoIdentity;
    secretHash = '17dlkm3vvufapqf8cv4p3252j3m4j4rd6t69bo5jc1kheqovcoui'
    clientId = '2ng9ud2h1cd4het746tcldvlh2'
    userPoolId = 'eu-west-1_aSUDsld3S';

    constructor() {
        this.cognitoIdentity = new AWS.CognitoIdentityServiceProvider(this.config);
    }

    async adminSignIn(username, password) {

        const params = {
            "AuthFlow": "ADMIN_USER_PASSWORD_AUTH",
            "AuthParameters": {
                "USERNAME": username,
                "PASSWORD": password
            },
            "ClientId": this.clientId,
            "UserPoolId": this.userPoolId
        }

        const tokens = await this.cognitoIdentity.adminInitiateAuth(params).promise();
        console.log(tokens);

        return tokens

    }

    async createUser(username, password, userAttributes) {

        // const params = {
        //     UserPoolId: this.userPoolId,
        //     TemporaryPassword: password,
        //     Username: username,
        //     UserAttributes: userAttributes,
        //     MessageAction: "SUPRESS",
        //     AuthFlow: "ADMIN_NO_SRP_AUTH",
        // }

        let params = {
            UserPoolId: this.userPoolId,
            Username: username,
            MessageAction: "SUPPRESS", // Do not send welcome email
            TemporaryPassword: password,
            UserAttributes: userAttributes
        };

        const res = await this.cognitoIdentity.adminCreateUser(params).promise()

        return res

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




}

module.exports = CognitoService
