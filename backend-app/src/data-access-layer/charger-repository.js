const { Client } = require('pg')

module.exports = function({ databaseInit }) {

    const exports = {}

    exports.getChargers = function(callback) {
        databaseInit.Chargers.findAll({ raw: true })
            .then(chargers => callback([], chargers))
            .catch(e => {
                console.log(e)
                callback(["internallError", []])
            })
    }

    exports.getCharger = function(chargerId, callback) {
        databaseInit.Chargers.findOne({ where: { chargerID: chargerId }, raw: true })
            .then(charger => callback([], charger))
            .catch(e => {
                console.log(e)
                callback(["internallError"], [])
            })
    }

    exports.getAvailableChargers = function(callback) {
        databaseInit.Chargers.findAll({ where: { status: 1 }, raw: true })
            .then(chargers => callback([], chargers))
            .catch(e => {
                console.log(e)
                callback(["internallError"], [])
            })
    }

    exports.addCharger = function(chargerId, chargePointId, location, callback) {

        const charger = {
            chargerID: chargerId,
            location: point = {
                type: 'Point',
                coordinates: location
            },
            chargePointID: chargePointId,
            status: 0
        }

        databaseInit.Chargers.create(charger)
            .then(a => callback([], true))
            .catch(e => {
                console.log(e)
                callback(["internalError"], false)
            })
    }

    exports.removeCharger = function(chargerId, callback) {
        databaseInit.Chargers.destroy({
                where: { chargerID: chargerId },
                raw: true
            })
            .then(_ => {

                callback([], true)

            })
            .catch(e => {
                console.log(e)
                callback(["internalError"], false)
            })
    }

    exports.updateChargerStatus = function(chargerId, status, callback) {
        databaseInit.Chargers.update({
                status: status
            }, {
                where: { chargerID: chargerId },
                returning: true,
                raw: true
            })
            .then(a => callback([], true))
            .catch(e => {
                console.log(e)
                callback(['internalError'], false)
            })
    }


    return exports
}