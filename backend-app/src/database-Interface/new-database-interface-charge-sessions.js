module.exports = function({ newDataAccessLayerChargeSessions, dbErrorCheck }) {

    const exports = {}
    
    exports.addChargeSession = function(chargerID, userID, database, callback) {
        // TODO Add validation for currentChargePercentage format... refer to addCharger method

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

    exports.getChargeSession = function(chargeSessionID, database, callback) {
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

    exports.getChargeSessions = function(chargerID, callback) {
        // TODO fetch all chargeSessions for a charger...
    }

    exports.updateChargingState = function(chargeSessionID, currentChargePercentage, kwhTransfered, database, callback) {
        // TODO Validate currentChargePercentage & kwhTransfered...
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

    return exports
}