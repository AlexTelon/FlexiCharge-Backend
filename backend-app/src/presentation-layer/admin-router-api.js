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
        // authMiddleware.verifyToken(req, res);

        const { username, password } = req.body;

        cognito.setUserPassword(username, password)
            .then(result => {
                if (result.statusCode === 201) {
                    res.status(200).json(result).end();
                } else {
                    console.log(result);
                    res.status(result.statusCode).json(result).end();
                }
            })
    })

    router.get('/user/:username', function (req, res) {
        const username = req.params.username
        cognito.getUser(username)
            .then(result => {
                if (result.statusCode === 200) {
                    console.log(result);
                    res.status(200).json(result.data).end();
                } else {
                    console.log(result);
                    res.status(result.statusCode).json(result).end();
                }
            })
    })

    router.get('/users/:limit', function (req, res) {
        const limit = req.params.limit

        cognito.getUsers(limit)
            .then(result => {
                if (result.statusCode === 200) {
                    console.log(result);
                    res.status(200).json(result.data).end();
                } else {
                    console.log(result);
                    res.status(result.statusCode).json(result).end();
                }

            })
    })

    router.post('/create-user', function (req, res) {
        // authMiddleware.verifyToken(req, res);

        const { username, password, email, name, family_name } = req.body;
        let userAttributes = [];
        userAttributes.push({ Name: 'email', Value: email });
        userAttributes.push({ Name: 'name', Value: name });
        userAttributes.push({ Name: 'family_name', Value: family_name });

        cognito.createUser(username, password, userAttributes)
            .then(result => {
                if (result.statusCode === 201) {
                    console.log(result);
                    res.status(201).json(result.data).end();
                } else {
                    console.log(result);
                    res.status(result.statusCode).json(result).end();
                }
            })
    })

    router.delete('/user/:username', function (req, res) {
        const username = req.params.username;

        cognito.deleteUser(username)
            .then(result => {
                if (result.statusCode === 200) {
                    console.log(result);
                    res.status(200).json(result.data).end();
                } else if (result.statusCode === 400) {
                    console.log(result);
                    res.status(400).json(result).end();
                } else {
                    console.log(result);
                    res.status(500).json(result).end();
                }
            })
    })

    router.patch('/user/:username', function (req, res) {

        const username = req.params.username;
        const { userAttributes } = req.body;

        cognito.updateUser(username, userAttributes)
            .then(result => {
                if (result.statusCode === 201) {
                    res.status(200).json(result.data).end();

                } else if (result.statusCode === 400) {
                    console.log(result);
                    res.status(400).json(result).end();
                } else {
                    console.log(result);
                    res.status(500).json(result).end();
                }
            })
    })

    router.post('/reset-user-password/:username', function (req, res) {
        const username = req.params.username;

        cognito.resetUserPassword(username)
            .then(result => {
                console.log(result);
                if (result.statusCode === 200) {
                    res.status(200).json(result.data).end();
                } else if (result.statusCode === 400) {
                    res.status(400).json(result).end();
                } else {
                    res.status(500).json(result).end();
                }
            })
    })

    router.post('/set-admin-password', function (req, res) {
        // authMiddleware.verifyToken(req, res);

        const { username, password } = req.body;

        cognito.setAdminPassword(username, password)
            .then(result => {
                res.status(200).json(result).end();
            })
    })

    return router
}