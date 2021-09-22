const { Client } = require('pg')

module.exports = function({ databaseInit }) {

    const exports = {}

    exports.getReservation = function(reservationID, callback) {
        databaseInit.Reservations.findOne({ where: { reservationID: reservationID }, raw: true })
            .then(reservation => callback([], reservation))
            .catch(e => {
                console.log(e)
                callback(["internalError"], [])
            })
    }

    exports.getReservationForCharger = function(chargerID, callback) {
        databaseInit.Reservations.findAll({ where: { chargerID: chargerID }, raw: true })
            .then(chargerReservation => callback([], chargerReservation))
            .catch(e => {
                console.log(e)
                callback(["internalError"], [])
            })
    }

    exports.getReservationForUser = function(userID, callback) {
        databaseInit.Reservations.findAll({ where: { userID: userID }, raw: true })
            .then(userReservation => callback([], userReservation))
            .catch(e => {
                console.log(e)
                callback(["internalError"], [])
            })
    }

    exports.addReservation = function(chargerID, userID, start, end, callback) {
        const reservation = {
            chargerID: chargerID,
            userID: userID,
            start: start,
            end: end
        }
        databaseInit.Reservations.create(reservation)
            .then(reservation => callback([], reservation.reservationID))
            .catch(e => {
                if (e) {
                    console.log(e)
                    callback("couldNotCreateReservation", false)
                } else {
                    console.log(e)
                    callback(e, null)
                }
            })

    }

    exports.removeReservation = function(reservationID, callback) {
        databaseInit.Reservations.destroy({
                where: { reservationID: reservationID },
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


    return exports
}