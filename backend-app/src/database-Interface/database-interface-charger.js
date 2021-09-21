module.exports = function({ dataAccessLayerCharger, dbErrorCheck, validationConstants }) {

    const exports = {}

    // function getLocationValidationErrors(location){
    //     const LocationValidationErrors = []
 
    //     if(location[0] < validationConstants.LATITUDE_MIN_VALUE || location[0] > validationConstants.LATITUDE_MAX_VALUE){
    //         LocationValidationErrors.push("invalidLatitude")
    //     }
    //     if(location[1] < validationConstants.LONGITUDE_MIN_VALUE || location[1] > validationConstants.LONGITUDE_MAX_VALUE){
    //         LocationValidationErrors.push("invalidLongitude")
    //     }

    //     return LocationValidationErrors
    // }


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

    exports.addCharger = function(chargePointId, serialNumber, location, callback) {
        dataAccessLayerCharger.addCharger(chargePointId, serialNumber, location, function(error, chargerId) {
            if (Object.keys(error).length > 0) {
                dbErrorCheck.checkError(error, function(errorCode) {
                    console.log(errorCode)
                    callback(errorCode, [])
                })
            } else {
                callback([], chargerId)
            }
        })
    }

    exports.removeCharger = function(chargerId, callback) {
        dataAccessLayerCharger.removeCharger(chargerId, function(error, chargerRemoved) { //chargerRemoved = bool
            if (Object.keys(error).length > 0) {
                dbErrorCheck.checkError(error, function(errorCode) {
                    callback(errorCode, chargerRemoved)
                })
            } else {
                callback([], chargerRemoved)
            }
        })
    }


    exports.updateChargerStatus = function(chargerId, status, callback) {
        if(status >= validationConstants.STATUS_MIN_VALUE && status <= validationConstants.STATUS_MAX_VALUE) {
            dataAccessLayerCharger.updateChargerStatus(chargerId, status, function(error, charger) {
                if (Object.keys(error).length > 0) {
                    dbErrorCheck.checkError(error, function(errorCode) {
                        callback(errorCode, [])
                    })
                } else {
                    callback([], charger)
                }
            })
        }else{
            callback(["invalidStatus"], null)
        }
        
    }

    return exports
}