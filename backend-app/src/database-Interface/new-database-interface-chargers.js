module.exports = function({ newDataAccessLayerChargers, dbErrorCheck, newChargerValidation }) {

    const exports = {}
    
    exports.getChargers = function(database, callback) {
        newDataAccessLayerChargers.getChargers(database, function(error, chargers) {
            if (Object.keys(error).length > 0) {
                dbErrorCheck.checkError(error, function(errorCode) {
                    callback(errorCode, [])
                })
            } else {
                callback([], chargers)
            }
        })
    }

    exports.getCharger = function(chargerID, database, callback) {
        const validationErrors = newChargerValidation.getChargerValidation(chargerID)
        if(validationErrors.length > 0){
            callback(validationErrors, [])
        } else {
            newDataAccessLayerChargers.getCharger(chargerID, database, function(error, charger) {
                if (Object.keys(error).length > 0) {
                    dbErrorCheck.checkError(error, function(errorCode) {
                        callback(errorCode, [])
                    })
                } else {
                    if (charger == null) {
                        callback([], [])
                    } else {
                        callback([], charger)
                    }
                }
            })
        }
    }

    exports.getChargerBySerialNumber = function(serialNumber, database, callback) {
        const validationErrors = newChargerValidation.getChargerBySerialNumberValidation(serialNumber)
        if (validationErrors.length > 0) {
            callback(validationErrors, [])
        } else {
            newDataAccessLayerChargers.getChargerBySerialNumber(serialNumber, database, function(error, charger) {
                if (Object.keys(error).length > 0) {
                    dbErrorCheck.checkError(error, function(errorCode) {
                        callback(errorCode, [])
                    })
                } else {
                    if (charger == null) {
                        callback([], [])
                    } else {
                        callback([], charger)
                    }

                }
            })
        }
    }


    exports.getAvailableChargers = function(database, callback) {
        newDataAccessLayerChargers.getAvailableChargers(database, function(error, chargers) {
            if (Object.keys(error).length > 0) {
                dbErrorCheck.checkError(error, function(errorCode) {
                    callback(errorCode, [])
                })
            } else {
                callback([], chargers)
            }
        })
    }

    exports.addCharger = function(chargePointID, serialNumber, coordinates, database, callback) {
        const ValidationErrors = newChargerValidation.getAddChargerValidation(coordinates, serialNumber, chargePointID)
        if (ValidationErrors.length > 0) {
            callback(ValidationErrors, [])
        } else {
            newDataAccessLayerChargers.addCharger(chargePointID, serialNumber, coordinates, database, function(error, chargerID) {
                if (Object.keys(error).length > 0) {
                    dbErrorCheck.checkError(error, function(errorCode) {
                        callback(errorCode, [])
                    })
                } else {
                    callback([], chargerID)
                }
            })
        }
    }

    exports.removeCharger = function(chargerID, database, callback) {
        const validationErrors = newChargerValidation.getRemoveChargerValidation(chargerID)
        if(validationErrors.length > 0){
            callback(validationErrors, [])
        } else {
            newDataAccessLayerChargers.removeCharger(chargerID, database, function(error, chargerRemoved) { //chargerRemoved = bool
                if (Object.keys(error).length > 0) {
                    dbErrorCheck.checkError(error, function(errorCode) {
                        callback(errorCode, chargerRemoved)
                    })
                } else {
                    callback([], chargerRemoved)
                }
            })
        }
    }


    exports.updateChargerStatus = function(chargerID, status, callback) {
<<<<<<< HEAD
        const validationError = newChargerValidation.getUpdateChargerStatusValidation(status)
        if (validationError.length > 0) {
            callback(validationError, [])
=======
        const validationErrors = newChargerValidation.getUpdateChargerStatusValidation(status)
        if (validationErrors.length > 0) {
            callback(validationErrors, [])
>>>>>>> 9517073b152305b7fd2750751f580e251c488cdd
        } else {
            newDataAccessLayerChargers.updateChargerStatus(chargerID, status, function(error, charger) {
                if (Object.keys(error).length > 0) {
                    dbErrorCheck.checkError(error, function(errorCode) {
                        callback(errorCode, [])
                    })
                } else {
                    callback([], charger)
                }
            })
        }
    }

    return exports
}