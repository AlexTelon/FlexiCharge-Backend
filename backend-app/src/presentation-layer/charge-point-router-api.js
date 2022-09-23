var express = require('express')
const jwtAuthz = require('express-jwt-authz');
const jwt = require('express-jwt');
const jwksRsa = require('jwks-rsa');

// Put in .env variable?
const checkIfAdmin = jwtAuthz(['Admins'], { customScopeKey: 'cognito:groups' });
const region = 'eu-west-1';
const adminUserPoolId = 'eu-west-1_1fWIOF9Yf';

const checkJwt = jwt({
    secret: jwksRsa.expressJwtSecret({
        cache: true,
        rateLimit: true,
        jwksRequestsPerMinute: 5,
        jwksUri: `https://cognito-idp.${region}.amazonaws.com/${adminUserPoolId}/.well-known/jwks.json`,
    }),
    issuer: [`https://dev-t3vri3ge.us.auth0.com/`, 'https://cognito-idp.eu-west-1.amazonaws.com/eu-west-1_1fWIOF9Yf'],
    algorithms: ['RS256']
});

module.exports = function ({ databaseInterfaceChargePoint }) {

    const router = express.Router()

    router.get('/', async function (request, response) {
        databaseInterfaceChargePoint.getChargePoints(null, function (error, chargePoints) {
            if (error.length == 0 && chargePoints.length == 0) {
                response.status(404).end()
            } else if (error.length == 0) {
                response.status(200).json(chargePoints)
            } else {
                response.status(500).json(error)
            }
        })
    })

    router.get('/:id', function (request, response) {
        const chargePointId = request.params.id
        databaseInterfaceChargePoint.getChargePoint(chargePointId, null, function (error, chargePoint) {
            if (error.length == 0 && chargePoint.length == 0) {
                response.status(404).end()
            } else if (error.length == 0) {
                response.status(200).json(chargePoint)
            } else {
                response.status(500).json(error)
            }
        })
    })

    router.post('/', checkJwt, checkIfAdmin, function (request, response) {
        const name = request.body.name
        const location = request.body.location
        const price = request.body.price
        const klarnaReservationAmount = request.body.klarnaReservationAmount
        databaseInterfaceChargePoint.addChargePoint(name, location, price, klarnaReservationAmount, function (errors, chargePointId) {
            if (errors.length > 0) {
                response.status(400).json(errors)
            } else if (chargePointId) {
                response.status(201).json(chargePointId)
            } else {
                response.status(500).json(errors)
            }
        })
    })
    router.delete('/:id', checkJwt, checkIfAdmin, function (request, response) {
        const chargePointId = request.params.id;
        databaseInterfaceChargePoint.removeChargePoint(chargePointId, function (error, chargePointRemoved) {
            if (error.length == 0 && chargePointRemoved) {
                response.status(204).json()
            } else if (error.length == 0 && !chargePointRemoved) {
                response.status(404).json()
            } else {
                response.status(500).json(error)
            }
        })
    })

    router.put('/:id', checkJwt, checkIfAdmin, function (request, response) {
        const chargePointId = request.params.id;
        const { name, location, price } = request.body;
        databaseInterfaceChargePoint.updateChargePoint(chargePointId, name, location, price, function (error, chargePoint) {
            if (error.length === 0 && chargePoint === undefined) {
                response.status(404).json(error);
            } else if (error.length > 0) {
                response.status(400).json(error);
            } else if (error.length === 0) {
                response.status(200).json(chargePoint)
            } else {
                response.status(500).json(error);
            }
        })
    })
    return router
}