var express = require('express')
const AuthMiddleware = require('./middleware/auth.middleware')
const authMiddleware = new AuthMiddleware()

module.exports = function ({ databaseInterfaceChargePoint }) {

    const router = express.Router()

    router.get('/', async function (request, response) {
        databaseInterfaceChargePoint.getChargePoints(function (error, chargePoints) {
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
        //authMiddleware.verifyToken(request, response);
        const chargePointId = request.params.id
        databaseInterfaceChargePoint.getChargePoint(chargePointId, function(error, chargePoint){
            if (error.length == 0 && chargePoint.length == 0) {
                response.status(404).end()
            } else if (error.length == 0) {
                response.status(200).json(chargePoint)
            } else {
                response.status(500).json(error)
            }
        })
    })

    router.post('/', function (request, response) {
        //authMiddleware.verifyToken(request, response);
        
    })

    router.delete('/:id', function (request, response) {
        //authMiddleware.verifyToken(request, response);
        
    })

    router.put('/:id', function (request, response) {
        // authMiddleware.verifyToken(request, response);
        
    })


    return router
}