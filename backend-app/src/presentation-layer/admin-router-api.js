var express = require('express')
const bodyParser = require('body-parser')
const AuthMiddleware = require('./middleware/auth.middleware')
const authMiddleware = new AuthMiddleware()

const AdminCognitoService = require('./services/cognito.admin.config')


module.exports = function () {
    const router = express.Router()
    const cognito = new AdminCognitoService();

    router.post('/sign-in', function (req, res) {

        const { username, password } = req.body;

        cognito.adminSignIn(username, password)
            .then(result => {
                if (!result.statusCode) {
                    res.status(200).json(result).end();
                } else if (result.statusCode === 400) {
                    res.status(400).json(result).end();
                } else {
                    console.log(result);
                    res.status(500).json(result).end();
                }
            })
    })

    router.post('/set-user-password', function (req, res) {
        authMiddleware.verifyToken(req, res);

        const { username, password } = req.body;

        cognito.setUserPassword(username, password)
            .then(result => {
                if (result.statusCode === 200) {
                    res.status(200).json(result).end();
                } else {
                    res.status(500).json(result).end();
                }
            })
    })

    router.get('/users/:limit', function (req, res) {
        const limit = req.params.limit

        cognito.getUsers(limit)
            .then(result => {
                if (result.statusCode === 200) {
                    console.log(result);
                    res.status(200).json(result).end();
                } else {
                    res.status(500).json(result).end();
                }

            })


    })

    router.post('/create-user', function (req, res) {
        authMiddleware.verifyToken(req, res);

        const { username, password, email, name, family_name } = req.body;
        let userAttributes = [];
        userAttributes.push({ Name: 'email', Value: email });
        userAttributes.push({ Name: 'name', Value: name });
        userAttributes.push({ Name: 'family_name', Value: family_name });

        cognito.createUser(username, password, userAttributes)
            .then(result => {
                res.status(200).json(result).end()
            })
    })

    router.post('/set-admin-password', function (req, res) {
        authMiddleware.verifyToken(req, res);

        const { username, password } = req.body;

        cognito.setAdminPassword(username, password)
            .then(result => {
                res.status(200).json(result).end();
            })
    })

    return router
}