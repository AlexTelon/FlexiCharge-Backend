const express = require('express')

module.exports = function ({ databaseInterfaceReservations }) {

    const router = express.Router()

    router.get('/', function (req, res) {
        const id = req.params.id
        databaseInterfaceReservations.getReservation(id,
            function(error,reservation){
               if(error.length > 0){
                  res.status(500).json(error)
               }else{
                 res.status(200).json(reservation)
               }
        })
    })

    router.get('/:userId', function (req, res) {
        res.send('Get specific reservation')
    })

    router.get('/:chargerId', function (req, res) {
        res.send('Get specific reservation')
    })

    router.post('/', function (req, res) {
        res.send('add reservations')
    })

    router.delete('/:id', function (req, res) {
        res.send('delete specific reservation')
    })

    return router
}