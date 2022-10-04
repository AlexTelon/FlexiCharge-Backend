module.exports = function({ newDataAccessLayerChargeSessions, newDataAccessLayerTransactions, newDatabaseInterfaceElectricityTariffs, dbErrorCheck, newChargeSessionValidation }) {

    const exports = {}
    
    exports.addChargeSession = function(chargerID, userID, payNow, paymentDueDate, paymentMethod, database, callback) {
        const validationErrors = newChargeSessionValidation.getAddChargeSessionValidation(chargerID, userID)
        if(validationErrors.length > 0){
            callback(validationErrors, [])
        } else {
            startTime = (Date.now() / 1000 | 0)
            newDataAccessLayerChargeSessions.addChargeSession(chargerID, userID, startTime, database, function(error, chargeSessionID) {
                if (Object.keys(error).length > 0) {
                    dbErrorCheck.checkError(error, function(errorCode) {
                        callback(errorCode, [])
                    })
                } else {
                    // Not tested
                    totalPrice = null
                    newDataAccessLayerTransactions.addTransaction(chargeSessionID, userID, payNow, paymentDueDate, paymentMethod, totalPrice, function(error, transactionID)  {
                        if(Object.keys(error).length > 0){
                            dbErrorCheck.checkError(error, function(errorCode) {
                                callback(errorCode, [])
                            })
                        } else {
                            console.log(transactionID)
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
        newDataAccessLayerChargeSessions.updateChargingEndTime(chargeSessionID, endTime, database, function(error, chargeSession) {
            if(Object.keys(error).length > 0){
                dbErrorCheck.checkError(error, function(errorCode) {
                    callback(errorCode, [])
                })
            } else {
                newDataAccessLayerTransactions.getTransactionForChargeSession(chargeSession.chargeSessionID, null, function(error, transaction){
                    if(Object.keys(error).length > 0){
                        dbErrorCheck.checkError(error, function(errorCode){
                            callback(errorCode, [])
                        })
                    } else {
                        newDatabaseInterfaceElectricityTariffs.getCurrentElectricityTariff(null, function(error, electricityTariff){
                            if(Object.keys(error).length > 0){
                                dbErrorCheck.checkError(error, function(errorCode){
                                    callback(errorCode, [])
                                })
                            } else {
                                //Extend to check if the charge session has gone longer than an hour and then both hours have tariffs and a average might be good?
                                const price = chargeSession.kwhTransfered * electricityTariff.price
                                newDataAccessLayerTransactions.updateTotalPrice(transaction.transactionID, price, function(error, updatedTransaction) {
                                    if(Object.keys(error).length > 0){
                                        dbErrorCheck.checkError(error, function(errorCode){
                                            callback(errorCode, [])
                                        })
                                    } else {
                                        chargeSession.totalPrice = price
                                        callback([], chargeSession)
                                    }
                                })
                            }
                        })
                    }
                })
            }
        })
    }

    exports.calculateTotalChargePrice = function(chargeSessionID, database, callback){
        // GL & HF
        // Step 1: Get kwhTransfered, startTime and endTime
        // Step 2: Get Electricity Tariff for the hours
        // Step 3: Return total Price
        // TODO: VALIDATION
        newDataAccessLayerChargeSessions.getChargeSession(chargeSessionID, database, function(error, chargeSession){
            if(Object.keys(error).length > 0){
                dbErrorCheck.checkError(error, function(errorCode) {
                    callback(errorCode, [])
                })
            } else {
                newDataAccessLayerTransactions.getTransactionForChargeSession(chargeSession.chargeSessionID, null, function(error, transaction){
                    if(Object.keys(error).length > 0){
                        dbErrorCheck.checkError(error, function(errorCode){
                            callback(errorCode, [])
                        })
                    } else {
                        newDatabaseInterfaceElectricityTariffs.getCurrentElectricityTariff(null, function(error, electricityTariff){
                            if(Object.keys(error).length > 0){
                                dbErrorCheck.checkError(error, function(errorCode){
                                    callback(errorCode, [])
                                })
                            } else {
                                const price = chargeSession.kwhTransfered * electricityTariff.price
                                console.log("price: ", price)
                                console.log(chargeSession)
                                console.log(transaction)
                                console.log(electricityTariff)

                            }
                        })
                    }
                })
                //console.log(kwhTransfered, startTime, endTime)
            }
        })
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