var express = require('express')
//const AuthMiddleware = require('./middleware/auth.middleware')
//const authMiddleware = new AuthMiddleware()

module.exports = function ({ databaseInterfaceCharger }) {

    const router = express.Router()

    router.get('/', function (request, response) {
        //authMiddleware.verifyToken(request, respone);
        databaseInterfaceCharger.getChargers(function (error, chargers) {
            if (error.length > 0) {
                response.status(500).json(error)
            } else {
                response.status(200).json(chargers)
            }
        }) 
    })

    router.get('/:id', function (request, response) {
        //authMiddleware.verifyToken(request, respone);
        const id = request.params.id
        databaseInterfaceCharger.getCharger(id, function (errors, charger) {
            if (errors.length == 0) {
                response.status(200).json(charger)
            } else {
                response.status(404).end(errors)
            }
        })
    })

    router.get('chargers/available', function(request, response){ 
        //authMiddleware.verifyToken(request, respone);
        databaseInterfaceCharger.getAvailableChargers(function (errors, chargers) {
            if (errors.length > 0) {
                response.status(404).end(errors)
            } else {
                response.status(200).json(chargers)
            }
        })
    })

    router.post('/', function(request, response){
        //authMiddleware.verifyToken(request, respone);
        const chargerPointId = request.body.chargePointID
        const location = request.body.location
        databaseInterfaceCharger.addCharger(chargerPointId, location, function (errorCodes, chargerId) {
            if (errorCodes.length == 0) {
                response.status(201).json(chargerId)
            } else {
                if (errorCodes == "internalError") {
                    response.status(500).end(errorCodes)
                } else {
                    response.status(404).end(errorCodes)
                }

            }
        })
    })

    router.delete('/:id', function(request, response){
        //authMiddleware.verifyToken(request, respone);
        const id = request.params.id
        databaseInterfaceCharger.removeCharger(id, function (errors) {
            if (errors.length == 0) {
                response.status(204).end()
            } else {
                response.status(404).end()
            }
        })
    })

    router.put('/:id', function(request,response){
        //authMiddleware.verifyToken(request, respone);
        const chargerId = request.params.id
        const newStatus = request.body.status
    
        databaseInterfaceCharger.updateChargerStatus(chargerId, newStatus, function (errors, charger) {
            if (errors.length == 0) {
                response.status(204).json(charger)
            } else {
                response.status(400).json(errors)
            }
        })
    })


    return router
}