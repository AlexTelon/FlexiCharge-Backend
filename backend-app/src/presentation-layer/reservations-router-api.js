const express = require('express')

module.exports = function ({ databaseInterfaceReservations }) {

    const router = express.Router()

    router.get('/:id', function (req, res) {
        res.send('Get reservation by id')
        // const id = req.params.id
        // databaseInterfaceReservations.getReservation(id, function(error, reservation){
        //     if(error.length == 0){
        //         es.status(200).json(reservation)
        //     }else{
        //         res.status(404).end(error)
        //     }
        // })
    })

    router.get('/:userId', function (req, res) {
        res.send('Get all reservations for a specific user')
    })

    router.get('/:chargerId', function (req, res) {
        res.send('Get specific reservation för a specific charger')
    })

    router.post('/', function (req, res) {
        res.send('add reservations')
    })

    router.delete('/:id', function (req, res) {
        res.send('delete reservation')
        // const id = request.params.id
        // databaseInterfaceCharger.removeReservation(id, function (errors) {
        //     if (errors.length == 0) {
        //         response.status(204).json()
        //     } else {
        //         response.status(404).end()
        //     }
        // })
    })



    return router
}