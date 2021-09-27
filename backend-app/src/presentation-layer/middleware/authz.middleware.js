const jwtAuthz = require('express-jwt-authz');
const jwt = require('express-jwt');
const jwksRsa = require('jwks-rsa');

const AuthMiddleware = require('./middleware/auth.middleware')
const authMiddleware = new AuthMiddleware()

const AdminCognitoService = require('./services/cognito.admin.config')
const checkIfAdmin = jwtAuthz(['Admins'], { customScopeKey: 'cognito:groups' });

const adminUserPoolId = 'eu-west-1_1fWIOF9Yf';

module.exports = function () {

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

}