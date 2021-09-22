module.exports = function({ dataAccessLayerReservation }) {

    const exports = {}

    exports.getReservation = function(reservationID, callback) {
        dataAccessLayerReservation.getReservation(reservationID, function(errorCodes, reservation) {
            if (errorCodes.length > 0) {
                callback(errorCodes, [])
            } else {
                callback([], reservation)
            }
        })

    }

    exports.getReservationForCharger = function(chargerID, callback) {
        dataAccessLayerReservation.getReservationForCharger(chargerID, function(errorCodes, chargerReservation) {
            if (errorCodes.length > 0) {
                callback(errorCodes, [])
            } else {
                callback([], chargerReservation)
            }
        })
    }

    exports.getReservationForUser = function(userID, callback) {
        dataAccessLayerReservation.getReservationForUser(userID, function(errorCodes, userReservation) {
            if (errorCodes.length > 0) {
                callback(errorCodes, [])
            } else {
                callback([], userReservation)
            }
        })
    }

    exports.addReservation = function(chargerID, userID, start, end, callback) {
        dataAccessLayerReservation.addReservation(chargerID, userID, start, end, function(errorCodes, reservationId) {
            if (errorCodes.length > 0) {
                callback(errorCodes, [])
            } else {
                callback([], reservationId)
            }
        })
    }

    exports.removeReservation = function(reservationID, callback) {
        dataAccessLayerReservation.removeReservation(reservationID, function(errorCodes, removeReservation) { //removeReservation = bool
            if (errorCodes.length > 0) {
                callback(errorCodes, [])
            } else {
                callback([], removeReservation)
            }
        })
    }


    return exports
}