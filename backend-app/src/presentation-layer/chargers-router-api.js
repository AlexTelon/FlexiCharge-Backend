var express = require('express')
const AuthMiddleware = require('./middleware/auth.middleware')
const authMiddleware = new AuthMiddleware()

module.exports = function ({ databaseInterfaceCharger }) {

    const router = express.Router()

    router.get('/', function (request, response) {
        authMiddleware.verifyToken(request, response);
        databaseInterfaceCharger.getChargers(function (error, chargers) {
            if (error.length > 0) {
                response.status(500).end(error)
            } else {
                response.status(200).json(chargers)
            }
        })
    })

    router.get('/:id', function (request, response) {
        authMiddleware.verifyToken(request, response);
        const id = request.params.id
        databaseInterfaceCharger.getCharger(id, function (errors, charger) {
            if (errors.length == 0) {
                response.status(200).json(charger)
            } else {
                response.status(200).end(charger)
            }
        })
    })

    router.get('/chargers/available', function(request, response){ 
<<<<<<< HEAD
        //authMiddleware.verifyToken(request, respone);
=======
        authMiddleware.verifyToken(request, response);
>>>>>>> a7508465bf1f4be895bcae8940e4c67025511af8
        databaseInterfaceCharger.getAvailableChargers(function (errors, chargers) {
            if (errors.length > 0) {
                response.status(404).end(errors)
            } else {
                response.status(200).json(chargers)
            }
        })
    })

    router.post('/', function(request, response){
        authMiddleware.verifyToken(request, response);
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

    router.delete('/:id', function (request, response) {
        authMiddleware.verifyToken(request, response);
        const id = request.params.id
        databaseInterfaceCharger.removeCharger(id, function (errors) {
            if (errors.length == 0) {
                response.status(204).json()
            } else {
                response.status(404).end()
            }
        })
    })

    router.put('/:id', function(request,response){
        authMiddleware.verifyToken(request, response);
        const chargerId = request.params.id
        const newStatus = request.body.status
<<<<<<< HEAD
    
        databaseInterfaceCharger.updateChargerStatus(chargerId, newStatus, function (errors, chargerUpdated) {
=======
        databaseInterfaceCharger.updateChargerStatus(chargerId, newStatus, function (errors, charger) {
>>>>>>> a7508465bf1f4be895bcae8940e4c67025511af8
            if (errors.length == 0) {
                response.status(204).json(chargerUpdated)
            } else {
                response.status(400).end(errors)
            }
        })
    })


    return router
}