module.exports = function ({ newDataAccessLayerReservations, newReservationValidation, dbErrorCheck }) {

    const exports = {}

    exports.getReservation = function (reservationID, database, callback) {
        const validationErrors = newReservationValidation.getReservationValidation(reservationID)
        if(validationErrors.length > 0) {
            callback(validationErrors, [])
        } else {
            newDataAccessLayerReservations.getReservation(reservationID, database, function (error, reservation) {
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

    exports.getReservationsForCharger = function (chargerID, database, callback) {
        const validationErrors = newReservationValidation.getReservationsForChargerValidation(chargerID)
        if(validationErrors.length > 0){
            callback(validationErrors, [])
        } else {
            newDataAccessLayerReservations.getReservationsForCharger(chargerID, database, function (error, chargerReservation) {
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

    exports.getReservationsForUser = function (userID, database, callback) {
        const validationErrors = newReservationValidation.getReservationsForUserValidation(userID)
        if(validationErrors.length > 0){
            callback(validationErrors, [])
        } else {
            newDataAccessLayerReservations.getReservationsForUser(userID, database, function (error, userReservation) {
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

    exports.addReservation = function (chargerID, userID, start, end, database, callback) {
        const validationError = newReservationValidation.getAddReservationValidation(start, end)
        if (validationError.length > 0) {
            callback(validationError, [])
        } else {
            newDataAccessLayerReservations.addReservation(chargerID, userID, start, end, database, function (error, reservationID) {
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

    exports.removeReservation = function (reservationID, database, callback) {
        const validationErrors = newReservationValidation.getRemoveReservationValidation(reservationID)
        if(validationErrors.length > 0){
            callback(validationErrors, [])
        } else {
            newDataAccessLayerReservations.removeReservation(reservationID, database, function (error, removeReservation) { //removeReservation = bool
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