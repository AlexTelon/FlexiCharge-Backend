const { Client } = require('pg')

module.exports = function({ databaseInit }) {

    const exports = {}

    exports.getReservation = function(reservationID, database, callback) {
        if (database == null) {
            database = newDataAccessLayerReservations.getReservation
        }

        database.findOne({ where: { reservationID: reservationID }, raw: true })
            .then(reservation => callback([], reservation))
            .catch(e => {
                console.log(e)
                callback(e, [])
            })
    }

    exports.getReservationsForCharger = function(chargerID, database, callback) {
        if (database == null) {
            database = newDataAccessLayerReservations.getReservation
        }

        database.findAll({ where: { chargerID: chargerID }, raw: true })
            .then(chargerReservation => callback([], chargerReservation))
            .catch(e => {
                console.log(e)
                callback(e, [])
            })
    }

    exports.getReservationsForUser = function(userID, database, callback) {
        if (database == null) {
            database = newDataAccessLayerReservations.getReservation
        }

        database.findAll({ where: { userID: userID }, raw: true })
            .then(userReservation => callback([], userReservation))
            .catch(e => {
                console.log(e)
                callback(e, [])
            })
    }

    exports.addReservation = function(chargerID, userID, start, end, database, callback) {
        if (database == null) {
            database = newDataAccessLayerReservations.getReservation
        }

        const reservation = {
            chargerID: chargerID,
            userID: userID,
            start: start,
            end: end
        }
        database.create(reservation)
            .then(reservation => callback([], reservation.reservationID))
            .catch(e => {
                console.log(e)
                callback(e, [])
            })

    }

    exports.removeReservation = function(reservationID, database, callback) {
        if (database == null) {
            database = newDataAccessLayerReservations.getReservation
        }

        database.destroy({
                where: { reservationID: reservationID },
                raw: true
            })
            .then(numberOfDeletedReservations => {
                if (numberOfDeletedReservations == 0) {
                    callback([], false)
                } else {
                    callback([], true)
                }
            })
            .catch(e => {
                console.log(e)
                callback(e, [])
            })
    }


    return exports
}