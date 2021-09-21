const AWS = require('aws-sdk')
const { createHmac } = require('crypto')
const AuthMiddleware = require('../middleware/auth.middleware')
const auth = new AuthMiddleware()

const path = require('path')
const dirPath = path.join(__dirname, '/config.json')

AWS.config.loadFromPath(dirPath);
AWS.config.getCredentials(function (err) {
    if (err) console.log(err.stack);
    // credentials not loaded
    else {
        // console.log("Access key:", AWS.config.credentials.accessKeyId);
    }
});

// const authError = {
//     message: 'The user is not authorized for this content.',
//     code: 'UserNotAuthorizedException',
//     statusCode: '403'
// }

class AdminCognitoService {

    config = {
        region: 'eu-west-1'
    }
    cognitoIdentity;
    secretHash = 'gbnne4qg7d44sdmom0ovoa3r9030qnguttq91j1aeandlven5r8'
    clientId = '3hcnd5dm9a0cjiqnmuvcu0dbqa'
    userPoolId = 'eu-west-1_1fWIOF9Yf';

    constructor() {
        this.cognitoIdentity = new AWS.CognitoIdentityServiceProvider();
        AWS.config.getCredentials(function (err) {
            console.log(1337);
            if (err) console.log(err.stack);
            // credentials not loaded
            else {
                // console.log("Access key:", AWS.config.credentials.accessKeyId);
            }
        });
    }

    async setUserPassword(username, password) {

        const params = {
            "Password": password,
            "Permanent": true,
            "Username": username,
            UserPoolId: 'eu-west-1_aSUDsld3S', // not admin userpool
        }

        try {
            const res = await this.cognitoIdentity.adminSetUserPassword(params).promise();
            console.log(res);

            return res;
        } catch (error) {
            console.log(error);
            return error
        }
    }

    async setAdminPassword(username, password) {

        const params = {
            "Password": password,
            "Permanent": true,
            "Username": username,
            UserPoolId: this.userPoolId, // not admin userpool
        }

        try {
            const res = await this.cognitoIdentity.adminSetUserPassword(params).promise();
            console.log(res);

            return res;
        } catch (error) {
            console.log(error);
            return error
        }
    }

    async adminSignIn(username, password) {
        const params = {
            "AuthFlow": "ADMIN_USER_PASSWORD_AUTH",
            "AuthParameters": {
                "USERNAME": username,
                "PASSWORD": password,
                'SECRET_HASH': this.generateHash(username)
            },
            "ClientId": this.clientId,
            "UserPoolId": this.userPoolId
        }
        try {
            const tokens = await this.cognitoIdentity.adminInitiateAuth(params).promise();
            const userdata = await auth.decodeToken(tokens.AuthenticationResult.IdToken);

            const data = {
                accessToken: tokens.AuthenticationResult.AccessToken,
                email: userdata.email,
                username: userdata['cognito:username'],
                name: userdata.name,
                family_name: userdata.family_name,
                user_id: userdata.sub
            }
            console.log(data);
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

    async getUsers(limit) {
        const params = {
            Limit: limit,
            UserPoolId: 'eu-west-1_aSUDsld3S', // not admin userpool
        }
        try {
            const res = await this.cognitoIdentity.listUsers(params).promise();
            console.log(res);
            const data = {
                data: res,
                statusCode: 200
            }
            return data
        } catch (error) {
            console.log(error);
            return error
        }
    }

    async createUser(userId, password, userAttributes) {

        let params = {
            UserPoolId: 'eu-west-1_aSUDsld3S', // not admin userpool
            Username: userId,
            MessageAction: "SUPPRESS", // Do not send welcome email
            TemporaryPassword: password,
            UserAttributes: userAttributes
        };
        try {
            const res = await this.cognitoIdentity.adminCreateUser(params).promise();
            return res

        } catch (error) {
            console.log(error);
            return error
        }
    }





}

module.exports = AdminCognitoService
