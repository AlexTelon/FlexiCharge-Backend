const { Client } = require('pg')

module.exports = function ({ databaseInit }) {

    const exports = {}

    exports.getReservation = function (reservationID, callback) {
        databaseInit.Reservations.findOne({ where: { reservationID: reservationID }, raw: true })
            .then(reservation => callback([], reservation))
            .catch(e => {
                console.log(e)
                callback(e, [])
            })
    }

    exports.getReservationForCharger = function (connectorID, callback) {
        databaseInit.Reservations.findAll({ where: { connectorID: connectorID }, raw: true })
            .then(chargerReservation => callback([], chargerReservation))
            .catch(e => {
                console.log(e)
                callback(e, [])
            })
    }

    exports.getReservationForUser = function (userID, callback) {
        databaseInit.Reservations.findAll({ where: { userID: userID }, raw: true })
            .then(userReservation => callback([], userReservation))
            .catch(e => {
                console.log(e)
                callback(e, [])
            })
    }

    exports.addReservation = function (connectorID, userID, start, end, callback) {
        const reservation = {
            connectorID: connectorID,
            userID: userID,
            start: start,
            end: end
        }
        databaseInit.Reservations.create(reservation)
            .then(reservation => callback([], reservation.reservationID))
            .catch(e => {
                console.log(e)
                callback(e, [])
            })

    }

    exports.removeReservation = function (reservationID, callback) {
        databaseInit.Reservations.destroy({
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