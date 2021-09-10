var express = require('express')
const bodyParser = require('body-parser')

const CognitoService = require('./cognito.config')

module.exports = function ({ businessLogicDatabase }) {

    const router = express.Router()

    router.get('/', (request, response) => {
        response.send('AuthZzzzZZzzzzz')
    })

    router.post('/sign-up', function (req, res) {

        // console.log(req.body);
        const { username, password, email, name, family_name } = req.body;
        const cognito = new CognitoService();

        let userAttributes = [];
        userAttributes.push({ Name: 'email', Value: email });
        userAttributes.push({ Name: 'name', Value: name });
        userAttributes.push({ Name: 'family_name', Value: family_name });

        cognito.signUpUser(username, password, userAttributes)
            .then(result => {
                if (result) {
                    // console.log(result);
                    console.log(200);
                    res.status(200).end()
                } else {
                    // console.log(result);
                    console.log(500);
                    res.status(500).end()
                }
            });
    })

    router.get('/sign-in', function (req, res) {
        res.send('sign-in')
    })
    router.get('/verify', function (req, res) {
        res.send('verify')
    })


    return router
}