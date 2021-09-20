const express = require('express')

module.exports = function ({ databaseInterfaceReservations }) {

    const router = express.Router()

    router.get('/:id', function (req, res) {
        const id = req.params.id
        databaseInterfaceReservations.getReservation(id, function(error, reservation){
            if(error.length == 0){
                res.status(200).json(reservation)
            }else{
                res.status(404).end(error)
            }
        })
    })

    router.get('/:userId', function (req, res) {
        res.send('Get all reservations for a specific user')
    })

    router.get('/chargerReservation/:chargerID', function (req, res) {
        const chargerId = req.params.chargerID
        databaseInterfaceReservations.getReservationForCharger(chargerId, function(error, chargerReservation){
            if(error.length == 0){
                res.status(200).json(chargerReservation)
            }else{
                res.status(404).end(error)
            }
        })
    })

    router.post('/', function (req, res) {
        res.send('add reservations')
    })

    router.delete('/:id', function (req, res) {
        const id = req.params.id
        databaseInterfaceReservations.removeReservation(id, function (errors) {
            if (errors.length == 0) {
                res.status(204).json()
            } else {
                res.status(404).end()
            }
        })
    })



    return router
}