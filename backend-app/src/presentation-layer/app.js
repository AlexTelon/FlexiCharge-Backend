const express = require("express")
const expressHandlebars = require('express-handlebars');
const app = express()
const bodyParser = require('body-parser')
require('dotenv').config()

const jwt = require('express-jwt');
const jwtAuthz = require('express-jwt-authz');
const jwksRsa = require('jwks-rsa');

const checkScopes = jwtAuthz(['aws.cognito.signin.user.admin']);

const region = 'eu-west-1';
const adminUserPoolId = 'eu-west-1_1fWIOF9Yf';
// Authorization middleware. When used, the
// Access Token must exist and be verified against
// the Auth0 JSON Web Key Set
const checkJwt = jwt({
    // Dynamically provide a signing key
    // based on the kid in the header and 
    // the signing keys provided by the JWKS endpoint.
    secret: jwksRsa.expressJwtSecret({
        cache: true,
        rateLimit: true,
        jwksRequestsPerMinute: 5,
        jwksUri: `https://cognito-idp.${region}.amazonaws.com/${adminUserPoolId}/.well-known/jwks.json`,
        // jwksUri: `https://dev-t3vri3ge.us.auth0.com/.well-known/jwks.json`
    }),

    // Validate the audience and the issuer.
    // audience: 'flexicharge.app',
    issuer: [`https://dev-t3vri3ge.us.auth0.com/`, 'https://cognito-idp.eu-west-1.amazonaws.com/eu-west-1_1fWIOF9Yf'],
    algorithms: ['RS256']
});
module.exports = function ({ chargersRouter, transactionsRouter, reservationsRouter, authenticationRouter, databaseTestRouter, adminRouter }) { //authenticationRouter

    app.set('views', '/backend-app/src/presentation-layer/views')
    app.engine('.hbs', expressHandlebars({ extname: '.hbs' }));
    app.set('view engine', 'hbs')
    app.engine("hbs", expressHandlebars({
        defaultLayout: 'main.hbs'
    }))
    app.use(bodyParser.urlencoded({ extended: false }))
    app.use(bodyParser.json())
    app.use(function (request, response, next) {
        console.log(request.method, request.url);

        response.setHeader("Access-Control-Allow-Origin", "*") // "localhost:3000"
        response.setHeader("Access-Control-Allow-Methods", "*") // GET, POST, PUT, DELETE
        response.setHeader("Access-Control-Allow-Headers", "*")
        response.setHeader("Access-Control-Expose-Headers", "*")

        next()
    })

    app.get('/api/public', function (req, res) {
        res.json({
            message: 'Hello from a public endpoint! You don\'t need to be authenticated to see this.'
        });
    });

    app.get('/api/private', checkJwt, function (req, res) {
        res.json({
            message: 'Hello from a private endpoint! You need to be authenticated to see this.'
        });
    });

    app.get('/api/private-scoped', checkJwt, checkScopes, function (req, res) {
        res.json({
            message: 'Hello from a private endpoint! You need to be authenticated and have a scope of read:messages to see this.'
        });
    });

    app.get('/', (req, res) => {
        res.render('index.hbs')
    })
    app.use('/chargers', chargersRouter)
    app.use('/transactions', transactionsRouter)
    app.use('/reservations', reservationsRouter)
    app.use('/auth', authenticationRouter)
    app.use('/auth/admin', adminRouter)

    app.use('/database', databaseTestRouter)

    return app

}
