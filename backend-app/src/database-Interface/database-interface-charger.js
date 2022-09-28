module.exports = function({ dataAccessLayerCharger, dbErrorCheck, chargerValidation }) {

    const exports = {}


    exports.getChargers = function(callback) {
        dataAccessLayerCharger.getChargers(function(error, chargers) {
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
        dataAccessLayerCharger.getCharger(chargerID, function(error, charger) {
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
            dataAccessLayerCharger.getChargerBySerialNumber(serialNumber, function(error, charger) {
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
        dataAccessLayerCharger.getAvailableChargers(function(error, chargers) {
            if (Object.keys(error).length > 0) {
                dbErrorCheck.checkError(error, function(errorCode) {
                    callback(errorCode, [])
                })
            } else {
                callback([], chargers)
            }
        })
    }

    exports.addCharger = function(chargePointID, serialNumber, location, callback) {
        const ValidationError = chargerValidation.getAddChargerValidation(location, serialNumber, chargePointID)
        if (ValidationError.length > 0) {
            callback(ValidationError, [])
        } else {
            dataAccessLayerCharger.addCharger(chargePointID, serialNumber, location, function(error, chargerID) {
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

    exports.removeCharger = function(chargerID, callback) {
        dataAccessLayerCharger.removeCharger(chargerID, function(error, chargerRemoved) { //chargerRemoved = bool
            if (Object.keys(error).length > 0) {
                dbErrorCheck.checkError(error, function(errorCode) {
                    callback(errorCode, chargerRemoved)
                })
            } else {
                callback([], chargerRemoved)
            }
        })
    }


    exports.updateChargerStatus = function(chargerID, status, callback) {
        const validationError = chargerValidation.getUpdateChargerStatusValidation(status)
        if (validationError.length > 0) {
            callback(validationError, [])
        } else {
            dataAccessLayerCharger.updateChargerStatus(chargerID, status, function(error, charger) {
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