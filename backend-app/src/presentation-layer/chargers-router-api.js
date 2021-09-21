var express = require('express')
const AuthMiddleware = require('./middleware/auth.middleware')
const authMiddleware = new AuthMiddleware()

module.exports = function ({ databaseInterfaceCharger }) {

    const router = express.Router()

    router.get('/', function (request, response) {
        //authMiddleware.verifyToken(request, response);
        databaseInterfaceCharger.getChargers(function (error, chargers) {
            if (error.length > 0) {
                response.status(500).json(error)
            } else {
                response.status(200).json(chargers)
            }
        })
    })

    router.get('/:id', function (request, response) {
        //authMiddleware.verifyToken(request, response);
        const id = request.params.id
        databaseInterfaceCharger.getCharger(id, function (errors, charger) {
            if (errors.length == 0 && charger.length == 0) {
                response.status(404).end()
            } else if (errors.length == 0) {
                response.status(200).json(charger)
            } else {
                response.status(500).json(errors)
            }
        })
    })

<<<<<<< HEAD
    router.get('/chargers/available', function(request, response){ 
       // authMiddleware.verifyToken(request, response);
=======
    router.get('/chargers/available', function (request, response) {
        //authMiddleware.verifyToken(request, response);
>>>>>>> da671398429f409f1ed030bcd338f9fee1b7bfc0
        databaseInterfaceCharger.getAvailableChargers(function (errors, chargers) {
            if (errors.length > 0) {
                response.status(404).json(errors)
            } else {
                response.status(200).json(chargers)
            }
        })
    })

<<<<<<< HEAD
    router.post('/', function(request, response){
=======
    router.post('/', function (request, response) {
>>>>>>> da671398429f409f1ed030bcd338f9fee1b7bfc0
        //authMiddleware.verifyToken(request, response);
        const chargerPointId = request.body.chargePointID
        const location = request.body.location
        databaseInterfaceCharger.addCharger(chargerPointId, location, function (errorCodes, chargerId) {
            if (errorCodes.length == 0) {
                response.status(201).json(chargerId)
            } else {
                if (errorCodes.includes("internalError") || errorCodes.includes("dbError")) {
                    response.status(500).json(errorCodes)
                } else {
                    response.status(404).json(errorCodes)
                }

            }
        })
    })

    router.delete('/:id', function (request, response) {
        //authMiddleware.verifyToken(request, response);
        const id = request.params.id
        databaseInterfaceCharger.removeCharger(id, function (errors, isChargerDeleted) {
            if (errors.length == 0 && isChargerDeleted) {
                response.status(204).json()
            } else if (errors.length == 0 && !isChargerDeleted) {
                response.status(404).json()
            } else {
                response.status(500).json(errors)
            }
        })
    })

<<<<<<< HEAD
    router.put('/:id', function(request,response){
       // authMiddleware.verifyToken(request, response);
=======
    router.put('/:id', function (request, response) {
        //authMiddleware.verifyToken(request, response);
>>>>>>> da671398429f409f1ed030bcd338f9fee1b7bfc0
        const chargerId = request.params.id
        const newStatus = request.body.status
        databaseInterfaceCharger.updateChargerStatus(chargerId, newStatus, function (errors, charger) {
            if (errors.length == 0) {
                response.status(200).json(charger)
            } else {
                response.status(400).json(errors)
            }
        })
    })


    return router
}