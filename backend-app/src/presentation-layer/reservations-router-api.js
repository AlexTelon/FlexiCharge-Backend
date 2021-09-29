const express = require('express')
const AuthMiddleware = require('./middleware/auth.middleware')
const authMiddleware = new AuthMiddleware()

module.exports = function ({ databaseInterfaceReservations, ocppInterface }) {

    const router = express.Router()

    router.get('/:id', function (request, response) {
        //authMiddleware.verifyToken(request, response);
        const reservationId = request.params.id
        databaseInterfaceReservations.getReservation(reservationId, function (errors, reservation) {
            if (errors.length == 0 && reservation.length == 0) {
                response.status(404).end()
            } else if (errors.length == 0) {
                response.status(200).json(reservation)
            } else {
                response.status(500).json(errors)
            }
        })
    })

    router.get('/userReservation/:userID', function (request, response) {
        //authMiddleware.verifyToken(request, response);
        const userId = request.params.userID
        databaseInterfaceReservations.getReservationForUser(userId, function(error, userReservation){
            if(error.length == 0 && userReservation.length == 0){
                response.status(404).end()
            } else if (error.length == 0) {
                response.status(200).json(userReservation)
            } else {
                response.status(500).json(error)
            }
        })    
    })

    router.get('/chargerReservation/:chargerID', function (request, response) {
        //authMiddleware.verifyToken(request, response);
        const chargerId = request.params.chargerID
        databaseInterfaceReservations.getReservationForCharger(chargerId, function (error, chargerReservation) {
            if (error.length == 0 && chargerReservation.length == 0) {
                response.status(404).end()
            } else if (error.length == 0) {
                response.status(200).json(chargerReservation)
            } else {
                response.status(500).json(error)
            }
        })
    })

    router.post('/', function (request, response) {
        const { chargerID, userID, start, end } = request.body;
        databaseInterfaceReservations.addReservation(chargerID, userID, start, end, function (errors, reservation) {
            if (errors.length > 0) {
                response.status(400).json(errors)
            } else if (reservation) {
                response.status(201).json(reservation)
            } else {
                response.status(500).json(errors)
            }
        })

    })

    router.delete('/:id', function (request, response) {
        //authMiddleware.verifyToken(request, response);
        const reservationId = request.params.id
        databaseInterfaceReservations.removeReservation(reservationId, function (errors, isReservationDeleted) {
            if (errors.length == 0 && isReservationDeleted) {
                response.status(204).json()
            } else if (errors.length == 0 && !isReservationDeleted) {
                response.status(404).json()
            } else {
                response.status(500).json(errors)
            }
        })
    })

    router.put('/', function (request, response) {
        const chargerId = request.body.chargerID
        const connectorId = request.body.connectorID
        const idTag = request.body
        chargerID, connectorID, idTag, reservationID, parentIdTag
        const transactionId = request.params.transactionID
        const meterValue = request.body.meterStop
        ocppInterface.reservNow(transactionId, meterValue, function(error, updateTransactionMeter){
            if (error.length == 0) {
                response.status(201).json(updateTransactionMeter)
            } else {
                if (error.includes("internalError") || error.includes("dbError")) {
                    response.status(500).json(error)
                } else {
                    response.status(404).json(error)
                }
            }
        })
    })

    router.put('/:chargerID', function (request, response) {
        const chargerId = request.params.chargerID
        const connectorId = request.body.connectorID
        const idTag = request.body.idTag
        const reservationId = request.body.reservationID
        const parentIdTag = request.body.parentIdTag
        ocppInterface.reservNow(chargerId, connectorId, idTag, reservationId, parentIdTag, function(error, updateResev){
            if (error.length == 0) {
                response.status(201).json(updateResev)
            } else {
                if (error.includes("internalError") || error.includes("dbError")) {
                    response.status(500).json(error)
                } else {
                    response.status(404).json(error)
                }
            }
        })
    })

    return router
}