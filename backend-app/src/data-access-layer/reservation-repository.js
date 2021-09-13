const { Client } = require('pg')

module.exports = function({ databaseInit }) {

    const exports = {}

    exports.createReservations = function(reservation, callback) {

        databaseInit.Reservations.create(reservation)
            .then(a => callback([], reservation.reservationID))
            .catch(e => {
                if (e) {
                    console.log(e)
                    callback("Can not create reservation", null)
                } else {
                    console.log(e)
                    callback(e, null)
                }
            })

    }
    return exports
}