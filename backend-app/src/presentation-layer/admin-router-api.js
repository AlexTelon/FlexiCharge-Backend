var express = require('express')
const bodyParser = require('body-parser')

const AdminCognitoService = require('./services/cognito.admin.config')


module.exports = function () {
    const router = express.Router()
    const cognito = new AdminCognitoService();

    router.post('/sign-in', function (req, res) {

        const { username, password } = req.body;

        cognito.adminSignIn(username, password)
            .then(result => {
                if (result.statusCode === 200) {
                    res.status(200).json(result).end();
                } else if (result.statusCode === 400) {
                    res.status(400).json(result).end();
                } else {
                    console.log(result);
                    res.status(500).json(result).end();
                }
            })
    })

    router.post('/create-user', function (req, res) {
        const { username, email, password } = req.body;

        cognito.createCognitoUser(username, email, password)
            .then(result => {
                res.status(200).json(result).end();
                // console.log(result);
            })
    })

    router.post('/set-user-password', function (req, res) {
        const { username, password } = req.body;

        cognito.setUserPassword(username, password)
            .then(result => {
                res.status(200).json(result).end();
            })

    })

    router.post('/create-user', function (req, res) {

        const { username, password, email, name, family_name } = req.body;
        let userAttributes = [];
        userAttributes.push({ Name: 'email', Value: email });
        userAttributes.push({ Name: 'name', Value: name });
        userAttributes.push({ Name: 'family_name', Value: family_name });
        userAttributes.push({ Name: 'email_verrified', Value: true });

        cognito.createUser(username, password, userAttributes)
            .then(result => {
                res.status(200).json(result).end()
            })

    })

    // router.post('/admin/sign-in', function (req, res) {

    //     const { username, password } = req.body;

    //     cognito.signInAdmin(username, password)
    //         .then(result => {
    //             if (result.statusCode === undefined) {
    //                 res.status(200).json(result).end()
    //             } else if (result.statusCode === 403) {
    //                 res.status(403).json(result).end()
    //             } else {
    //                 res.status(400).json({ message: result.message, code: result.code, statusCode: result.statusCode }).end()
    //             }
    //         })

    // })

    return router
}