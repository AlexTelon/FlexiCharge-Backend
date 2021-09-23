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

class AdminCognitoService {

    config = {
        region: 'eu-west-1'
    }
    cognitoIdentity;
    secretHash = 'gbnne4qg7d44sdmom0ovoa3r9030qnguttq91j1aeandlven5r8'
    clientId = '3hcnd5dm9a0cjiqnmuvcu0dbqa'
    adminUserPool = 'eu-west-1_1fWIOF9Yf'; // admin
    userPool = 'eu-west-1_aSUDsld3S'

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
            UserPoolId: this.userPool, // not admin userpool
        }

        try {
            const res = await this.cognitoIdentity.adminSetUserPassword(params).promise();
            const data = {
                data: res,
                statusCode: 201
            }
            return data
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
            "UserPoolId": this.adminUserPool
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
            "UserPoolId": this.adminUserPool
        }
        try {
            const tokens = await this.cognitoIdentity.adminInitiateAuth(params).promise();
            const userdata = await auth.decodeToken(tokens.AuthenticationResult.IdToken);
            console.log(userdata);

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

    async deleteUser(username) {
        const params = {
            "Username": username,
            "UserPoolId": this.userPool
        }

        try {

            const res = await this.cognitoIdentity.adminDeleteUser(params).promise();
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

    async updateUser(username, userAttributes) {
        const params = {
            "Username": username,
            "UserPoolId": this.userPool,
            "UserAttributes": userAttributes
        }
        console.log(params);
        try {
            const res = await this.cognitoIdentity.adminUpdateUserAttributes(params).promise();
            console.log(res);
            const data = {
                data: res,
                statusCode: 201
            }
            return data

        } catch (error) {
            console.log(error);
            return error
        }
    }

    async resetUserPassword(username) {
        const params = {
            "Username": username,
            "UserPoolId": this.userPool
        }

        try {
            const res = await this.cognitoIdentity.adminResetUserPassword(params).promise();
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

    async getUser(username) {
        const params = {
            "Username": username,
            "UserPoolId": this.userPool, // not admin userpool
        }
        try {

            const res = await this.cognitoIdentity.adminGetUser(params).promise();
            const data = {
                data: res,
                statusCode: 200
            }
            return data

        } catch (error) {
            console.log(error);
            return error;
        }
    }


    async getUsers(limit) {
        const params = {
            Limit: limit,
            UserPoolId: this.userPool, // not admin userpool
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
            UserPoolId: this.userPool, // not admin userpool
            Username: userId,
            MessageAction: "SUPPRESS", // Do not send welcome email
            TemporaryPassword: password,
            UserAttributes: userAttributes
        };
        try {
            const res = await this.cognitoIdentity.adminCreateUser(params).promise();
            console.log(res);
            const data = {
                data: res,
                statusCode: 201
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

}

module.exports = AdminCognitoService
