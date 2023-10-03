const express = require('express')
const AuthMiddleware = require('./middleware/auth.middleware')
const authenticate = new AuthMiddleware().verifyToken;

module.exports = function ({ newDatabaseInterfaceReservations, ocppInterface }) {

    const router = express.Router()

    router.get('/:id', function (request, response) {
        const reservationId = request.params.id
        newDatabaseInterfaceReservations.getReservation(reservationId, function (errors, reservation) {
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
        const userID = request.params.userID

        ////////////////////////////////////////////////
        // A user can only view its own reservations? //
        ////////////////////////////////////////////////

        newDatabaseInterfaceReservations.getReservationsForUser(userId, function (error, userReservation) {
            if (error.length == 0 && userReservation.length == 0) {
                response.status(404).end()
            } else if (error.length == 0) {
                response.status(200).json(userReservation)
            } else {
                response.status(500).json(error)
            }
        })
    })

    router.get('/chargerReservation/:chargerID', function (request, response) {
        const chargerId = request.params.chargerID
        newDatabaseInterfaceReservations.getReservationsForCharger(chargerId, function (error, chargerReservation) {
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

        // Skicka access token istället för userID?
        const { chargerID, userID, start, end } = request.body;
        newDatabaseInterfaceReservations.addReservation(chargerID, userID, start, end, function (errors, reservation) {
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

        //////////////////////////////////////////////////
        // A user can only remove its own reservations? //
        //////////////////////////////////////////////////
        const reservationId = request.params.id
        newDatabaseInterfaceReservations.removeReservation(reservationId, function (errors, isReservationDeleted) {
            if (errors.length == 0 && isReservationDeleted) {
                response.status(204).json()
            } else if (errors.length == 0 && !isReservationDeleted) {
                response.status(404).json()
            } else {
                response.status(500).json(errors)
            }
        })
    })

    router.put('/:chargerId', function (request, response) {
        const chargerID = request.params.chargerId
        const connectorID = request.body.connectorId
        const idTag = request.body.idTag
        const reservationID = request.body.reservationId
        const parentIdTag = request.body.parentIdTag
        ocppInterface.reserveNow(chargerID, connectorID, idTag, reservationID, parentIdTag, function (error, resp) {
            if (error === null && resp != null) {
                response.status(201).json(resp)
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
