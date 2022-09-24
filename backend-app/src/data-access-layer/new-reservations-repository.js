const { Client } = require('pg')

module.exports = function({ databaseInit }) {

    const exports = {}

    exports.getReservation = function(reservationID, callback) {
        databaseInit.newReservations.findOne({ where: { reservationID: reservationID }, raw: true })
            .then(reservation => callback([], reservation))
            .catch(e => {
                console.log(e)
                callback(e, [])
            })
    }

    exports.getReservationForCharger = function(chargerID, callback) {
        databaseInit.newReservations.findAll({ where: { chargerID: chargerID }, raw: true })
            .then(chargerReservation => callback([], chargerReservation))
            .catch(e => {
                console.log(e)
                callback(e, [])
            })
    }

    exports.getReservationForUser = function(userID, callback) {
        databaseInit.newReservations.findAll({ where: { userID: userID }, raw: true })
            .then(userReservation => callback([], userReservation))
            .catch(e => {
                console.log(e)
                callback(e, [])
            })
    }

    exports.addReservation = function(chargerID, userID, start, end, callback) {
        const reservation = {
            chargerID: chargerID,
            userID: userID,
            start: start,
            end: end
        }
        databaseInit.newReservations.create(reservation)
            .then(reservation => callback([], reservation.reservationID))
            .catch(e => {
                console.log(e)
                callback(e, [])
            })

    }

    exports.removeReservation = function(reservationID, callback) {
        databaseInit.newReservations.destroy({
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