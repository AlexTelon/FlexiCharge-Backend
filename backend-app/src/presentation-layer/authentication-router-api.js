var express = require('express')
const checkJwt = require('./middleware/jwt.middleware')
const CognitoService = require('./services/cognito.config')

module.exports = function () {
    const router = express.Router()
    const cognito = new CognitoService();

    router.put('/update-user', function (req, res) {

        const { accessToken, firstName, lastName, phoneNumber, streetAddress, zipCode, city, country } = req.body;
        let userAttributes = [];
        userAttributes.push({ Name: 'name', Value: firstName });
        userAttributes.push({ Name: 'family_name', Value: lastName });
        userAttributes.push({ Name: 'phone_number', Value: phoneNumber });
        userAttributes.push({ Name: 'custom:street_address', Value: streetAddress });
        userAttributes.push({ Name: 'custom:zip_code', Value: zipCode });
        userAttributes.push({ Name: 'custom:city', Value: city });
        userAttributes.push({ Name: 'custom:country', Value: country });

        cognito.updateUserAttributes(accessToken, userAttributes)
            .then(result => {
                if (result.statusCode === 204) {
                    res.status(204).json(result.data).end();
                } else {
                    res.status(400).json(result).end();
                }
            })

    })

    router.post('/sign-up', function (req, res) {

        let { username, password } = req.body;

        cognito.signUpUser(username, password)
            .then(result => {
                if (result === true) {
                    res.status(200).end()
                } else {
                    res.status(400).json({ message: result.message, code: result.code, statusCode: result.statusCode }).end()
                }
            });
    })

    router.post('/forgot-password/:username', function (req, res) {
        const username = req.params.username;

        cognito.forgotPassword(username)
            .then(result => {
                if (result.statusCode === 200) {
                    res.status(200).json(result).end();
                } else {
                    res.status(400).json(result).end();
                }
            })
    })

    router.post('/change-password', function (req, res) {

        const { accessToken, previousPassword, newPassword } = req.body;

        cognito.changePassword(accessToken, previousPassword, newPassword)
            .then(result => {
                if (result.statusCode === 200) {
                    res.status(200).json(result.data).end();
                } else {
                    res.status(400).json(result).end();
                }
            })
    })

    router.post('/confirm-forgot-password', function (req, res) {
        const { username, password, confirmationCode } = req.body;

        cognito.confirmForgotPassword(username, password, confirmationCode)
            .then(result => {
                if (result.statusCode === 200) {
                    res.status(200).json(result).end();
                } else {
                    res.status(400).json(result).end();
                }
            })

    })

    router.post('/sign-in', function (req, res) {

        const { username, password } = req.body;

        cognito.signInUser(username, password)
            .then(result => {
                if (result.statusCode == 200) {
                    res.status(200).json(result.data).end()
                } else {
                    res.status(400).json(result).end();
                }
            })
    })

    router.post('/verify', function (req, res) {
        const { username, code } = req.body;

        cognito.verifyAccount(username, code)
            .then(result => {
                if (result === true) {
                    res.status(200).end()
                } else {
                    res.status(400).json(result).end()
                }
            })
    })

    router.post('/force-change-password', function (req, res) {
        const { username, password, session } = req.body;

        cognito.respondToAuthChallenge(username, password, session)
            .then(result => {
                if (result.statusCode === 200) {
                    res.status(200).json(result.data).end();
                } else {
                    res.status(400).json(result).end();
                }
            })
    })

    router.get('/user-information', checkJwt, async (req, res) => {
        const accessToken = req.header('authorization').split(' ')[1];
        try {
            const result = await cognito.getUserByAccessToken(accessToken);
            res.status(result.statusCode).json(result.data).end();
            
        } catch (error){
            res.status(error.statusCode).json(error).end();
        }
    });
    
    return router
}