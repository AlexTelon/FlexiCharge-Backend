var express = require('express')
var router = express.Router()
const bodyParser = require('body-parser')

const AuthMiddleware = require('./middleware/auth.middleware')
const authMiddleware = new AuthMiddleware();

module.exports = function ({ businessLogicDatabase }) {

    const router = express.Router()

    router.get('/secret', function (request, response) {

        // Verifierar token från request.header("Auth")
        // Om token är inkorrekt skicakr verifytoken tillbaka error code 401 ( Unauthorized )
        authMiddleware.verifyToken(request, response);

        // Om token är korrekt 
        response.send("Secret content")
    })

    return router

}