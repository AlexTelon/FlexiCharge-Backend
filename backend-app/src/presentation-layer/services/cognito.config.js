const AWS = require('aws-sdk')
// // const crypto = require('crypto-js')
// const sha256 = require('crypto-js/sha256');
// const hmac = require('crypto-js/hmac-sha256');
const { createHmac } = require('crypto')

class CognitoService {

    config = {
        region: 'eu-west-1'
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
        console.log(params);

        try {
            const data = await this.cognitoIdentity.signUp(params).promise();
            console.log(data);
            return true;

        } catch (error) {
            console.log(error);
            return false;
        }
    }

    generateHash(username) {
        return createHmac('SHA256', this.secretHash)
            .update(username + this.clientId)
            .digest("base64");
    }
}

module.exports = CognitoService