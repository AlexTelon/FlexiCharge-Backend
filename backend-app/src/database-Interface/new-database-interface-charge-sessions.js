module.exports = function({ newDataAccessLayerChargeSessions, dbErrorCheck }) {

    const exports = {}
    
    exports.addChargeSessions = function(chargerID, userID, callback) {
        // TODO Add validation for currentChargePercentage format... refer to addCharger method

        newDataAccessLayerChargeSessions.addChargeSessions(chargerID, userID, (error, chargeSessionID) => {
            if (Object.keys(error).length > 0) {
                dbErrorCheck.checkError(error, function(errorCode) {
                    callback(errorCode, [])
                })
            } else {
                callback([], chargeSessionID)
            }
        })
    }

    exports.getChargeSession = function(chargeSessionID, callback) {
        newDataAccessLayerChargeSessions.getChargeSession(chargeSessionID, function(error, chargeSession) {
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

    exports.updateChargingState = function(chargeSessionID, currentChargePercentage, kwhTransfered, callback) {
        // TODO Validate currentChargePercentage & kwhTransfered...
        newDataAccessLayerChargeSessions.updateChargingState(chargeSessionID, currentChargePercentage, kwhTransfered, (error, updatedChargingSession) => {
            if (Object.keys(error).length > 0) {
                dbErrorCheck.checkError(error, function(errorCode) {
                    callback(errorCode, [])
                })
            } else {
                if (updatedChargingSession == null) {
                    callback([], [])
                } else {
                    callback([], updatedChargingSession)
                }
            }
        }) 

    }

    return exports
}