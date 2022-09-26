module.exports = function ({ newDataAccessLayerReservation, reservationValidation, dbErrorCheck }) {

    const exports = {}

    exports.getReservation = function (reservationID, callback) {
        newDataAccessLayerReservation.getReservation(reservationID, function (error, reservation) {
            if (Object.keys(error).length > 0) {
                dbErrorCheck.checkError(error, function (errorCode) {
                    callback(errorCode, [])
                })
            } else {
                callback([], reservation)
            }
        })
    }

    exports.getReservationForCharger = function (chargerID, callback) {
        newDataAccessLayerReservation.getReservationForCharger(chargerID, function (error, chargerReservation) {
            if (Object.keys(error).length > 0) {
                dbErrorCheck.checkError(error, function (errorCode) {
                    callback(errorCode, [])
                })
            } else {
                if (chargerReservation == null) {
                    callback([], [])
                } else {
                    callback([], chargerReservation)
                }
            }
        })
    }

    exports.getReservationForUser = function (userID, callback) {
        newDataAccessLayerReservation.getReservationForUser(userID, function (error, userReservation) {
            if (Object.keys(error).length > 0) {
                dbErrorCheck.checkError(error, function (errorCode) {
                    callback(errorCode, [])
                })
            } else {
                if (userReservation == null) {
                    callback([], [])
                } else {
                    callback([], userReservation)
                }
            }
        })
    }

    exports.addReservation = function (chargerID, userID, start, end, callback) {
        const validationError = reservationValidation.getAddReservationValidation(start, end)
        if (validationError.length > 0) {
            callback(validationError, [])
        } else {
            newDataAccessLayerReservation.addReservation(chargerID, userID, start, end, function (error, reservationId) {
                if (Object.keys(error).length > 0) {
                    dbErrorCheck.checkError(error, function (errorCode) {
                        callback(errorCode, [])
                    })
                } else {
                    callback([], reservationId)
                }
            })
        }
    }

    exports.removeReservation = function (reservationID, callback) {
        newDataAccessLayerReservation.removeReservation(reservationID, function (error, removeReservation) { //removeReservation = bool
            if (Object.keys(error).length > 0) {
                dbErrorCheck.checkError(error, function (errorCode) {
                    callback(errorCode, [])
                })
            } else {
                callback([], removeReservation)
            }
        })
    }


    return exports
}