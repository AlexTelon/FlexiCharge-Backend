var express = require('express')
const { request } = require('http')
var router = express.Router()

module.exports = function ({  }) {
    router.get('/', function (req, res) {
        .getChargers(function (error, chargers) {
            if (errorCodes.length > 0) {
                response.status(500).json(error)
            } else {
                response.status(200).json(chargers)
            }
        }) 
    })

    router.get('/:id', function (req, res) {
        const id = request.params.id
        .getCharger(id, function (errors, charger) {
            if (charger) {
                response.status(200).json(charger)
            } else {
                response.status(404).end()
            }
        })
    })

    router.get('/available', function(req, res){ 
        .getAvailableChargers(status, function (errors, charger) {
            if (status == 1) {
                response.status(200).json(chargers)
            } else {
                response.status(404).end()
            }
        })
    })

    router.post('/', function(req, res){
        const charger = {
            chargerID: request.body.chargerId,
            location: request.body.location,
            chargerPointID: request.body.chargerPointId,
            status: 0
        }
        .addCharger(charger, function (errorCodes) {
            if (errorCodes.length == 0) {
                response.status(201).json(charger)
            } else {
                if (errorCodes == "internalError") {
                    response.status(500).end()
                } else {
                    response.status(404).end()
                }

            }
        })
    })

    router.delete('/:id', function(req, res){
        const id = request.params.id
        .removeCharger(id, function (errors) {
            if (errors.length == 0) {
                response.status(204).end()
            } else {
                response.status(404).end()
            }
        })
    })

    router.put('/:id', function(req,res){
        const charger = {
            chargerId: request.params.id,
            newLocation: request.body.location,
            chargerPointID: request.body.chargerPointId,
            newStatus: request.body.status
        }
        .updateChargerStatus(charger, function (errors) {
            if (!charger) {
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