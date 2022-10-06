const AWS = require('aws-sdk')
const { createHmac } = require('crypto')
const AuthMiddleware = require('../middleware/auth.middleware')
const auth = new AuthMiddleware()
const CognitoResponseHandler = require('./cognito-response-handler')
const cognitoResponseHandler = new CognitoResponseHandler();
const config = require('../../config')

AWS.config.update({"region": config.AWS_REGION});

class AdminCognitoService {
    cognitoIdentity;
    secretHash = config.USER_POOL_SECRET
    clientId = config.USER_POOL_ID
    userPool = config.USER_POOL

    constructor() {
        this.cognitoIdentity = new AWS.CognitoIdentityServiceProvider();
    }

    async setUserPassword(username, password) {

        const params = {
            "Password": password,
            "Permanent": true,
            "Username": username,
            UserPoolId: this.userPool
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
            "UserPoolId": this.userPool
        }

        try {
            const res = await this.cognitoIdentity.adminSetUserPassword(params).promise();

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
            "UserPoolId": this.userPool
        }
        try {
            const tokens = await this.cognitoIdentity.adminInitiateAuth(params).promise();
            if (tokens.ChallengeName) {
                return tokens
            }
            const userdata = await auth.decodeToken(tokens.AuthenticationResult.IdToken);

            const data = {
                accessToken: tokens.AuthenticationResult.AccessToken,
                email: userdata.email,
                username: userdata['cognito:username'],
                name: userdata.name,
                family_name: userdata.family_name,
                user_id: userdata.sub
            }

            const res = {
                data: data,
                statusCode: 200
            }

            return res
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

    async deleteAdmin(username) {
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

    async updateUserAttributes(username, userAttributes) {
        const params = {
            "Username": username,
            "UserPoolId": this.userPool,
            "UserAttributes": userAttributes
        }
        try {
            const res = await this.cognitoIdentity.adminUpdateUserAttributes(params).promise();
            const data = {
                data: res,
                statusCode: 204
            }
            return data

        } catch (error) {
            console.log(error);
            return error
        }
    }

    async updateAdminAttributes(username, userAttributes) {
        const params = {
            "Username": username,
            "UserPoolId": this.userPool,
            "UserAttributes": userAttributes
        }
        try {
            const res = await this.cognitoIdentity.adminUpdateUserAttributes(params).promise();
            const data = {
                data: res,
                statusCode: 204
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
            "UserPoolId": this.userPool,
        }
        try {

            const res = await this.cognitoIdentity.adminGetUser(params).promise();
            const data = {
                data: cognitoResponseHandler.reformatUserInformationResponseWithUserId(res),
                statusCode: 200
            }
            return data

        } catch (error) {
            console.log(error);
            return error;
        }
    }

    async getUsers(paginationToken, limit = 60, filterAttribute = "username", filterValue = "") {

        const value = filterValue
        const attribute = filterAttribute

        let params = {
            Limit: limit,
            UserPoolId: this.userPool,
            GroupName: 'Users'
        }

        if (paginationToken !== undefined) {
            params = {
                NextToken: paginationToken,
                Limit: limit,
                UserPoolId: this.userPool,
                GroupName: 'Users'
            }
        }

        try {
            const res = await this.cognitoIdentity.listUsersInGroup(params).promise();
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

    async getAdmin(username) {
        const params = {
            "Username": username,
            "UserPoolId": this.userPool,
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

    async getAdmins(paginationToken, limit = 60, filterAttribute = "username", filterValue = "") {
        const value = filterValue
        const attribute = filterAttribute

        let params = {
            Limit: limit,
            UserPoolId: this.userPool,
            GroupName: 'Admins'
        }

        if (paginationToken !== undefined) {
            params = {
                NextToken: paginationToken,
                Limit: limit,
                UserPoolId: this.userPool,
                GroupName: 'Admins'
            }
        }

        try {
            const res = await this.cognitoIdentity.listUsersInGroup(params).promise();
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

    async createUser(username, password) {

        let params = {
            "UserPoolId": this.userPool,
            "Username": username,
            // "MessageAction": "SUPPRESS", // Do not send welcome email
            "TemporaryPassword": password
        };
        try {
            const res = await this.cognitoIdentity.adminCreateUser(params).promise();

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
    async createAdmin(username, password, userAttributes) {

        let params = {
            UserPoolId: this.userPool,
            Username: username,
            // MessageAction: "SUPPRESS", // Do not send welcome email
            TemporaryPassword: password,
            UserAttributes: userAttributes
        };
        try {
            const res = await this.cognitoIdentity.adminCreateUser(params).promise()
                .then(result => {
                    const paramsGroup = {
                        "GroupName": "Admins",
                        "Username": result.User.Username,
                        "UserPoolId": this.userPool
                    }
                    this.cognitoIdentity.adminAddUserToGroup(paramsGroup).promise();
                })

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

    async enableUser(username) {
        let params = {
            "Username": username,
            "UserPoolId": this.userPool
        }

        try {
            const res = await this.cognitoIdentity.adminEnableUser(params).promise();
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

    async disableUser(username) {
        let params = {
            "Username": username,
            "UserPoolId": this.userPool
        }

        try {
            const res = await this.cognitoIdentity.adminDisableUser(params).promise();
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
    async enableAdmin(username) {
        let params = {
            "Username": username,
            "UserPoolId": this.userPool
        }

        try {
            const res = await this.cognitoIdentity.adminEnableUser(params).promise();
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
    async disableAdmin(username) {
        let params = {
            "Username": username,
            "UserPoolId": this.userPool
        }

        try {
            const res = await this.cognitoIdentity.adminDisableUser(params).promise();
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

    async respondToAuthChallenge(username, password, session) {

        const params = {
            "ChallengeName": "NEW_PASSWORD_REQUIRED",
            "ChallengeResponses": {
                "USERNAME": username,
                "NEW_PASSWORD": password,
                "SECRET_HASH": this.generateHash(username)
            },
            "ClientId": this.clientId,
            "Session": session,
        }

        try {
            const tokens = await this.cognitoIdentity.respondToAuthChallenge(params).promise();
            if (tokens.ChallengeName) {
                return tokens
            }
            const userdata = await auth.decodeToken(tokens.AuthenticationResult.IdToken);

            const data = {
                accessToken: tokens.AuthenticationResult.AccessToken,
                email: userdata.email,
                username: userdata['cognito:username'],
                name: userdata.name,
                family_name: userdata.family_name,
                user_id: userdata.sub
            }

            const res = {
                data: data,
                statusCode: 200
            }
            return res

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
