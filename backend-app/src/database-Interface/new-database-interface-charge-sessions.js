module.exports = function({ newDataAccessLayerChargeSessions, dbErrorCheck, newChargeSessionValidation }) {

    const exports = {}
    
    exports.addChargeSession = function(chargerID, userID, database, callback) {
        const validationErrors = newChargeSessionValidation.getAddChargeSessionValidation(chargerID, userID)
        if(validationErrors.length > 0){
            callback(validationErrors, [])
        } else {
            newDataAccessLayerChargeSessions.addChargeSession(chargerID, userID, database, (error, chargeSessionID) => {
                if (Object.keys(error).length > 0) {
                    dbErrorCheck.checkError(error, function(errorCode) {
                        callback(errorCode, [])
                    })
                } else {
                    callback([], chargeSessionID)
                }
            })
        }
    }

    exports.getChargeSession = function(chargeSessionID, database, callback) {
        const validationErrors = newChargeSessionValidation.getChargeSessionValidation(chargeSessionID)
        if(validationErrors.length > 0){
            callback(validationErrors, [])
        } else {
            newDataAccessLayerChargeSessions.getChargeSession(chargeSessionID, database, function(error, chargeSession) {
                if (Object.keys(error).length > 0) {
                    dbErrorCheck.checkError(error, function(errorCode) {
                        callback(errorCode, [])
                    })
                } else {
                    if (chargeSession == null) {
                        callback([], [])
                    } else {
                        callback([], chargeSession)
                    }
                }
            })
        }
    }

    exports.getChargeSessions = function(chargerID, callback) {
        newDataAccessLayerChargeSessions.getChargeSession(chargerID, callback)
    }

    exports.updateChargingState = function(chargeSessionID, currentChargePercentage, kwhTransfered, database, callback) {
        const validationErrors = newChargeSessionValidation.getUpdateChargingStateValidation(currentChargePercentage, kwhTransfered)
        if(validationErrors.length > 0){
            callback(validationErrors, [])
        } else {
            newDataAccessLayerChargeSessions.updateChargingState(chargeSessionID, currentChargePercentage, kwhTransfered, database, (error, updatedChargingSession) => {
                if (Object.keys(error).length > 0) {
                    dbErrorCheck.checkError(error, function(errorCode) {
                        callback(errorCode, [])
                    })
                } else {
                    callback([], updatedChargingSession)
                }
            }) 
        }
    }

    return exports
}