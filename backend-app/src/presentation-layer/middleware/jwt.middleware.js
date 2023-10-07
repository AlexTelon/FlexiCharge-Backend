const jwt = require('express-jwt');
const jwksRsa = require('jwks-rsa');
const config = require('../../config');

const checkJwt = jwt({
    // Dynamically provide a signing key
    // based on the kid in the header and
    // the signing keys provided by the JWKS endpoint.
    secret: jwksRsa.expressJwtSecret({
        cache: true,
        rateLimit: true,
        jwksRequestsPerMinute: 5,
        jwksUri: `https://cognito-idp.${config.AWS_REGION}.amazonaws.com/${config.USER_POOL}/.well-known/jwks.json`,
    }),

    // Validate the audience and the issuer.
    // audience: 'flexicharge.app',
    issuer: [`https://cognito-idp.${config.AWS_REGION}.amazonaws.com/${config.USER_POOL}`],
    algorithms: ['RS256']
});

module.exports = checkJwt
