module.exports = function({ newDataAccessLayerChargeSessions, newDataAccessLayerTransactions, dbErrorCheck, newChargeSessionValidation }) {

    const exports = {}
    
    exports.addChargeSession = function(chargerID, userID, payNow, database, callback) {
        const validationErrors = newChargeSessionValidation.getAddChargeSessionValidation(chargerID, userID)
        if(validationErrors.length > 0){
            callback(validationErrors, [])
        } else {
            startTime = (Date.now() / 1000 | 0)
            newDataAccessLayerChargeSessions.addChargeSession(chargerID, userID, startTime, database, (error, chargeSessionID) => {
                if (Object.keys(error).length > 0) {
                    dbErrorCheck.checkError(error, function(errorCode) {
                        callback(errorCode, [])
                    })
                } else {
                    // Not tested
                    newDataAccessLayerTransactions.addTransaction(chargeSessionID, userID, payNow, null, null, (error, transactionID) => {
                        if(Object.keys(error).length > 0){
                            dbErrorCheck.checkError(error, function(errorCode) {
                                callback(errorCode, [])
                            })
                        } else {
                            callback([], chargeSessionID)   
                        }
                    })
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

    exports.endChargeSession = function(chargeSessionID, database, callback){
        //TODO: VALIDATION
        endTime = (Date.now() / 1000 | 0)
        newDataAccessLayerChargeSessions.updateChargingEndTime(chargeSessionID, endTime, function(error, updatedChargingSession) {
            if(Object.keys(error).length > 0){
                dbErrorCheck.checkError(error, function(errorCode) {
                    callback(errorCode, [])
                })
            } else {
                callback([], updatedChargingSession)
            }
        })
    }

    exports.calculateTotalChargePrice = function(chargeSessionID, database, callback){
        // GL & HF
        
    }

    exports.updateMeterStart = function(chargeSessionID, meterStart, database, callback) {
        // TODO Validation for updateMeterStart
        // const validationErrors = newChargeSessionValidation.getUpdateChargingStateValidation(currentChargePercentage, kwhTransfered)
        // if(validationErrors.length > 0){
        //     callback(validationErrors, [])
        // } else {
            
        // }

        newDataAccessLayerChargeSessions.updateMeterStart(chargeSessionID, meterStart, database, (error, updatedChargingSession) => {
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