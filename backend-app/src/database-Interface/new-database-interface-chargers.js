module.exports = function({ newDataAccessLayerCharger, dbErrorCheck, chargerValidation }) {

    const exports = {}
    
    exports.getChargers = function(callback) {
        newDataAccessLayerCharger.getChargers(function(error, chargers) {
            if (Object.keys(error).length > 0) {
                dbErrorCheck.checkError(error, function(errorCode) {
                    callback(errorCode, [])
                })
            } else {
                callback([], chargers)
            }
        })
    }

    exports.getCharger = function(chargerID, callback) {
        newDataAccessLayerCharger.getCharger(chargerID, function(error, charger) {
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


    exports.getChargerBySerialNumber = function(serialNumber, callback) {
        const validationError = chargerValidation.getChargerBySerialNumberValidation(serialNumber)
        if (validationError.length > 0) {
            callback(validationError, [])
        } else {
            newDataAccessLayerCharger.getChargerBySerialNumber(serialNumber, function(error, charger) {
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


    exports.getAvailableChargers = function(callback) {
        newDataAccessLayerCharger.getAvailableChargers(function(error, chargers) {
            if (Object.keys(error).length > 0) {
                dbErrorCheck.checkError(error, function(errorCode) {
                    callback(errorCode, [])
                })
            } else {
                callback([], chargers)
            }
        })
    }

    // TODO
    // location changed -> coordinates. Is the old location property actually coordinates? 
    // For backwards compatibility
    exports.addCharger = function(chargePointId, serialNumber, location, callback) {
        const ValidationError = chargerValidation.getAddChargerValidation(location, serialNumber, chargePointId)
        if (ValidationError.length > 0) {
            callback(ValidationError, [])
        } else {
            newDataAccessLayerCharger.addCharger(chargePointId, serialNumber, location, function(error, chargerId) {
                if (Object.keys(error).length > 0) {
                    dbErrorCheck.checkError(error, function(errorCode) {
                        callback(errorCode, [])
                    })
                } else {
                    callback([], chargerId)
                }
            })
        }
    }

    exports.removeCharger = function(chargerId, callback) {
        newDataAccessLayerCharger.removeCharger(chargerId, function(error, chargerRemoved) { //chargerRemoved = bool
            if (Object.keys(error).length > 0) {
                dbErrorCheck.checkError(error, function(errorCode) {
                    callback(errorCode, chargerRemoved)
                })
            } else {
                callback([], chargerRemoved)
            }
        })
    }


    // exports.updateChargerStatus = function(chargerId, status, callback) {
    //     const validationError = chargerValidation.getUpdateChargerStatusValidation(status)
    //     if (validationError.length > 0) {
    //         callback(validationError, [])
    //     } else {
    //         newDataAccessLayerCharger.updateChargerStatus(chargerId, status, function(error, charger) {
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