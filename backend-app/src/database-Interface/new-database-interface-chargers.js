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
        const validationError = newChargerValidation.getChargerBySerialNumberValidation(serialNumber)
        if (validationError.length > 0) {
            callback(validationError, [])
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
        const ValidationError = newChargerValidation.getAddChargerValidation(coordinates, serialNumber, chargePointID)
        if (ValidationError.length > 0) {
            callback(ValidationError, [])
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


    // exports.updateChargerStatus = function(chargerID, status, callback) {
    //     const validationError = chargerValidation.getUpdateChargerStatusValidation(status)
    //     if (validationError.length > 0) {
    //         callback(validationError, [])
    //     } else {
    //         newDataAccessLayerChargers.updateChargerStatus(chargerID, status, function(error, charger) {
    //             if (Object.keys(error).length > 0) {
    //                 dbErrorCheck.checkError(error, function(errorCode) {
    //                     callback(errorCode, [])
    //                 })
    //             } else {
    //                 callback([], charger)
    //             }
    //         })
    //     }
    // }

    return exports
}