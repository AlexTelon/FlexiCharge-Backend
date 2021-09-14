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
            if (charger) {
                response.status(200).json(charger)
            } else {
                response.status(404).end(errors)
            }
        })
    })

    router.get('/available', function(request, response){ 
        //authMiddleware.verifyToken(request, respone);
        databaseInterfaceCharger.getAvailableChargers(function (errors, chargers) {
            if (chargers) {
                response.status(200).json(chargers)
            } else {
                response.status(404).end(errors)
            }
        })
    })

    router.post('/', function(request, response){
        //authMiddleware.verifyToken(request, respone);
        const chargerId = request.body.chargerId
        const location = request.body.location
        const chargerPointId = request.body.chargerPointId
        databaseInterfaceCharger.addCharger(chargerId, location, chargerPointId, function (errorCodes) {
            if (errorCodes.length == 0) {
                response.status(201).json(chargerId, location, chargerPointId)
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
        const newLocation = request.body.location
        const chargerPointID = request.body.chargerPointId
        const newStatus = request.body.status
    
        databaseInterfaceCharger.updateChargerStatus(chargerId, newLocation, chargerPointID, newStatus, function (errors) {
            if (errors) {
                response.status(404).end()
            } else {
                if (errors.length == 0) {
                    response.status(204).end()
                } else {
                    response.status(400).json(errors)
                }
            }
        })
    })


    return router
}