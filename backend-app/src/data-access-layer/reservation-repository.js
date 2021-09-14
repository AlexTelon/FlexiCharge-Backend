const { Client } = require('pg')

module.exports = function({ databaseInit }) {

    const exports = {}

    exports.getReservation = function(reservationID, callback) {
        databaseInit.Reservations.findOne({ where: { reservationID: reservationID }, raw: true })
            .then(reservation => callback([], reservation))
            .catch(e => {
                console.log(e)
                callback(["internallError"], [])
            })
    }

    exports.getReservationForCharger = function(chargerID, callback){
        databaseInit.Reservations.findOne({ where: { chargerID: chargerID }, raw: true })
        .then(chargerReservation => callback([], chargerReservation))
        .catch(e=> {
            console.log(e)
            callback(["internallError"], [])
        })
    }

    exports.getReservationForUser = function(userID, callback){
        databaseInit.Reservations.findOne({ where: { userID: userID }, raw: true })
        .then(userReservation => callback([], userReservation))
        .catch(e => {
            console.log(e)
            callback(["internalError"], [])
        })
    }

    exports.addReservation = function(reservationID, chargerID, userID, start, end, callback){
        const reservation = {
            reservationID: reservationID,
            chargerID: chargerID,
            userID: userID,
            start: start,
            end: end
        }
        databaseInit.Reservations.create(reservation)
        .then(a => callback([], true))
        .catch(e => {
            if (e) {
                console.log(e)
                callback("Can not create reservation", false)
            } else {
                console.log(e)
                callback(e, null)
            }
        })
        
    }

    exports.removeReservation = function(reservationID, callback){
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