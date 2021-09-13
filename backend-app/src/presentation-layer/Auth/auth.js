var express = require('express')
var router = express.Router()
const bodyParser = require('body-parser')

const CognitoService = require('../services/cognito.config')

router.get('/', (request, response) => {
    response.send('AuthZzzzZZzzzzz')
})

router.post('/sign-up', function (req, res) {

    const { username, password, email, name, family_name } = req.body;
    const cognito = new CognitoService();

    let userAttributes = [];
    userAttributes.push({ Name: 'email', Value: email });
    userAttributes.push({ Name: 'name', Value: name });
    userAttributes.push({ Name: 'family_name', Value: family_name });

    cognito.signUpUser(username, password, userAttributes)
        .then(result => {
            if (result === true) {
                res.status(200).end()
            } else {
                res.json({ result }).end()
            }
        });
})

router.post('/sign-in', function (req, res) {

    const cognito = new CognitoService();

    const { username, password } = req.body;

    cognito.signInUser(username, password)
        .then(result => {
            res.json(result).end()
        })
})

router.post('/verify', function (req, res) {
    const { username, code } = req.body;
    const cognito = new CognitoService();

    cognito.verifyAccount(username, code)
        .then(result => {
            if (result === true) {
                res.status(200).json(result).end()
            } else {
                res.status(400).json(result).end()
            }
        })
})

module.exports = router