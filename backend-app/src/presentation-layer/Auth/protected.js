var express = require('express')
var router = express.Router()

const AuthMiddleware = require('../middleware/auth.middleware')
const authMiddleware = new AuthMiddleware();

router.get('/secret', (request, response) => {

    // Verifierar token från request.header("Auth")
    // Om token är inkorrekt skicakr verifytoken tillbaka error code 401 ( Unauthorized )
    authMiddleware.verifyToken(request, response);

    // Om token är korrekt 
    response.send("Authorized")
})

module.exports = router