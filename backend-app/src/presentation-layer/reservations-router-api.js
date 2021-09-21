const express = require('express')

module.exports = function ({ databaseInterfaceReservations }) {

    const router = express.Router()

    router.get('/:id', function (request, response) {
        //authMiddleware.verifyToken(request, response);
        const id = request.params.id
        databaseInterfaceReservations.getReservation(id, function (errors, reservation) {
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
        const userId = request.params.userID
        databaseInterfaceReservations.getReservationForUser(userId, function(error, userReservation){
            if(error.length == 0 && userReservation.length == 0){
                response.status(404).end()
            }else if(error.length == 0){
                response.status(200).json(userReservation)
            }else{
                response.status(500).json(error)
            }
        })    
    })

    router.get('/chargerReservation/:chargerID', function (request, response) {
        const chargerId = request.params.chargerID
        databaseInterfaceReservations.getReservationForCharger(chargerId, function(error, chargerReservation){
            if(error.length == 0 && chargerReservation.length == 0){
                response.status(404).end()
            }else if(error.length == 0){
                response.status(200).json(chargerReservation)
            }else{
                response.status(500).json(error)
            }
        })
    })

    router.post('/', function (request, response) {
        response.send('add reservations')
    })

    router.delete('/:id', function (request, response) {
        const reservationId = request.params.id
        databaseInterfaceReservations.removeReservation(reservationId, function (errors, isReservationDeleted) {
            if (errors.length == 0 && isReservationDeleted) {
                response.status(204).json()
            } else if(errors.length == 0 && !isReservationDeleted){
                response.status(404).json()
            }else{
                response.status(500).json(errors)
            }
        })
    })

    return router
}