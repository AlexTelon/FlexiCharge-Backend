module.exports = function ({ newDataAccessLayerReservations, newReservationValidation, dbErrorCheck }) {

    const exports = {}

    exports.getReservation = function (reservationID, callback) {
        const validationErrors = newReservationValidation.getReservationValidation(reservationID)
        if(validationErrors.length > 0) {
            callback(validationErrors, [])
        } else {
            newDataAccessLayerReservations.getReservation(reservationID, function (error, reservation) {
                if (Object.keys(error).length > 0) {
                    dbErrorCheck.checkError(error, function (errorCode) {
                        callback(errorCode, [])
                    })
                } else {
                    callback([], reservation)
                }
            })
        }
    }

    exports.getReservationForCharger = function (chargerID, callback) {
        const validationErrors = newReservationValidation.getReservationForChargerValidation(chargerID)
        if(validationErrors.length > 0){
            callback(validationErrors, [])
        } else {
            newDataAccessLayerReservations.getReservationForCharger(chargerID, function (error, chargerReservation) {
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
    }

    exports.getReservationForUser = function (userID, callback) {
        const validationErrors = newReservationValidation.getReservationForUserValidation(userID)
        if(validationErrors.length > 0){
            callback(validationErrors, [])
        } else {
            newDataAccessLayerReservations.getReservationForUser(userID, function (error, userReservation) {
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
    }

    exports.addReservation = function (chargerID, userID, start, end, callback) {
        const validationError = newReservationValidation.getAddReservationValidation(start, end)
        if (validationError.length > 0) {
            callback(validationError, [])
        } else {
            newDataAccessLayerReservations.addReservation(chargerID, userID, start, end, function (error, reservationID) {
                if (Object.keys(error).length > 0) {
                    dbErrorCheck.checkError(error, function (errorCode) {
                        callback(errorCode, [])
                    })
                } else {
                    callback([], reservationID)
                }
            })
        }
    }

    exports.removeReservation = function (reservationID, callback) {
        const validationErrors = newReservationValidation.getRemoveReservationValidation(reservationID)
        if(validationErrors.length > 0){
            callback(validationErrors, [])
        } else {
            newDataAccessLayerReservations.removeReservation(reservationID, function (error, removeReservation) { //removeReservation = bool
                if (Object.keys(error).length > 0) {
                    dbErrorCheck.checkError(error, function (errorCode) {
                        callback(errorCode, [])
                    })
                } else {
                    callback([], removeReservation)
                }
            })   
        }
    }


    return exports
}