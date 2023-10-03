module.exports = function ({ newDataAccessLayerChargeSessions, newDataAccessLayerTransactions, newDatabaseInterfaceElectricityTariffs, dbErrorCheck, newChargeSessionValidation, ocppInterface }) {

    const exports = {}

    exports.startChargeSession = function (chargerID, userID, payNow, paymentDueDate, paymentMethod, callback) {
        const validationErrors = newChargeSessionValidation.getAddChargeSessionValidation(chargerID, userID)
        if (validationErrors.length > 0) {
            callback(validationErrors, [])
        } else {
            startTime = (Date.now() / 1000 | 0)
            newDataAccessLayerChargeSessions.addChargeSession(chargerID, userID, startTime, function (error, chargeSession) {
                if (Object.keys(error).length > 0) {
                    dbErrorCheck.checkError(error, function (errorCode) {
                        callback(errorCode, [])
                    })
                } else {
                    // When chargeSession is added, it's started. Which in turn:
                    // 1. Creates a new transaction
                    // 2. Contacts OCPP interface and starts the remoteTransaction
                    totalPrice = null
                    newDataAccessLayerTransactions.addTransaction(chargeSession.chargeSessionID, userID, payNow, paymentDueDate, paymentMethod, totalPrice, function (error, transaction) {
                        if (Object.keys(error).length > 0) {
                            dbErrorCheck.checkError(error, function (errorCode) {
                                callback(errorCode, [])
                            })
                        } else {
                            ocppInterface.remoteStartTransaction(chargeSession.chargerID, transaction.transactionID, function (error, returnObject) {
                                if (error != null || returnObject.status == "Rejected") {
                                    callback(["couldNotStartOCPPTransaction"], [])
                                } else {
                                    newDataAccessLayerChargeSessions.updateMeterStart(chargeSession.chargeSessionID, returnObject.meterStart, (error, updatedChargeSession) => {
                                        if (Object.keys(error).length > 0) {
                                            dbErrorCheck.checkError(error, function (errorCode) {
                                                callback(errorCode, [])
                                            })
                                        } else {
                                            callback([], updatedChargeSession)
                                        }
                                    })
                                }
                            })
                        }
                    })


                }
            })
        }
    }

    exports.getChargeSession = function (chargeSessionID, callback) {
        const validationErrors = newChargeSessionValidation.getChargeSessionValidation(chargeSessionID)
        if (validationErrors.length > 0) {
            callback(validationErrors, [])
        } else {
            newDataAccessLayerChargeSessions.getChargeSession(chargeSessionID, function (error, chargeSession) {
                if (Object.keys(error).length > 0) {
                    dbErrorCheck.checkError(error, function (errorCode) {
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

    exports.getChargeSessions = function (chargerID, callback) {
        const validationErrors = newChargeSessionValidation.getChargeSessionsValidation(chargerID)
        if (validationErrors.length > 0) {
            callback(validationErrors, [])
        } else {
            newDataAccessLayerChargeSessions.getChargeSessions(chargerID, callback)
        }
    }

    exports.updateChargingState = function (chargeSessionID, currentChargePercentage, kWhTransferred, callback) {
        const validationErrors = newChargeSessionValidation.getUpdateChargingStateValidation(currentChargePercentage, kWhTransferred)
        if (validationErrors.length > 0) {
            callback(validationErrors, [])
        } else {
            newDataAccessLayerChargeSessions.updateChargingState(chargeSessionID, currentChargePercentage, kWhTransferred, (error, updatedChargingSession) => {
                if (Object.keys(error).length > 0) {
                    dbErrorCheck.checkError(error, function (errorCode) {
                        callback(errorCode, [])
                    })
                } else {
                    callback([], updatedChargingSession)
                }
            })
        }
    }

    exports.endChargeSession = function (chargeSessionID, callback) {
        const validationErrors = newChargeSessionValidation.endChargeSessionValidation(chargeSessionID)
        if (validationErrors.length > 0) {
            callback(validationErrors, [])
        } else {
            endTime = (Date.now() / 1000 | 0)
            newDataAccessLayerChargeSessions.updateChargingEndTime(chargeSessionID, endTime, function (error, chargeSession) {
                if (Object.keys(error).length > 0) {
                    dbErrorCheck.checkError(error, function (errorCode) {
                        callback(errorCode, [])
                    })
                } else {
                    newDataAccessLayerTransactions.getTransactionForChargeSession(chargeSessionID, function (error, transaction) {
                        if (Object.keys(error).length > 0) {
                            dbErrorCheck.checkError(error, function (errorCode) {
                                callback(errorCode, [])
                            })
                        } else {
                            ocppInterface.remoteStopTransaction(chargeSession.chargerID, transaction.transactionID, function (error, returnObject) {
                                if (error != null || returnObject.status == "Rejected") {
                                    callback(["couldNotStopOCPPTransaction"])
                                } else {
                                    const kWhTransferred = (returnObject.meterStop - chargeSession.meterStart) / 1000
    
                                    if (kWhTransferred >= 0) {
                                        newDataAccessLayerChargeSessions.updateChargingState(chargeSessionID, chargeSession.currentChargePercentage, kWhTransferred, function (error, updatedChargingSession) {
                                            if (Object.keys(error).length > 0) {
                                                dbErrorCheck.checkError(error, function (errorCode) {
                                                    callback(errorCode, [])
                                                })
                                            } else {
                                                newDatabaseInterfaceElectricityTariffs.getCurrentElectricityTariff(function (error, electricityTariff) {
                                                    if (Object.keys(error).length > 0) {
                                                        dbErrorCheck.checkError(error, function (errorCode) {
                                                            callback(errorCode, [])
                                                        })
                                                    } else {
                                                        //Extend to check if the charge session has gone longer than an hour and then both hours have tariffs and a average might be good?
                                                        const totalPrice = chargeSession.kWhTransferred * electricityTariff.price
                                                        newDataAccessLayerTransactions.updateTotalPrice(transaction.transactionID, totalPrice, function (error, updatedTransaction) {
                                                            if (Object.keys(error).length > 0) {
                                                                dbErrorCheck.checkError(error, function (errorCode) {
                                                                    callback(errorCode, [])
                                                                })
                                                            } else {
                                                                callback([], updatedChargingSession)
                                                            }
                                                        })
                                                    }
                                                })
                                            }
                                        })
                                    } else {
                                        callback(["couldNotStopOCPPTransaction"], [])
                                    }
                                }
                            })
                        }
                    })
                }
            })
        }

        
    }

    exports.calculateTotalChargePrice = function (chargeSessionID, callback) {
        const validationErrors = newChargeSessionValidation.calculateTotalChargePriceValidation(chargeSessionID)
        if (validationErrors.length > 0) {
            callback(validationErrors, [])
        } else {
            newDataAccessLayerChargeSessions.getChargeSession(chargeSessionID, function (error, chargeSession) {
                if (Object.keys(error).length > 0) {
                    dbErrorCheck.checkError(error, function (errorCode) {
                        callback(errorCode, [])
                    })
                } else {
                    newDataAccessLayerTransactions.getTransactionForChargeSession(chargeSession.chargeSessionID, function (error, transaction) {
                        if (Object.keys(error).length > 0) {
                            dbErrorCheck.checkError(error, function (errorCode) {
                                callback(errorCode, [])
                            })
                        } else {
                            newDatabaseInterfaceElectricityTariffs.getCurrentElectricityTariff(function (error, electricityTariff) {
                                if (Object.keys(error).length > 0) {
                                    dbErrorCheck.checkError(error, function (errorCode) {
                                        callback(errorCode, [])
                                    })
                                } else {
                                    const price = chargeSession.kWhTransferred * electricityTariff.price
                                    callback([], price)
                                }
                            })
                        }
                    })
                }
            })
        }
    }

    exports.updateMeterStart = function (chargeSessionID, meterStart, callback) {
        const validationErrors = newChargeSessionValidation.updateMeterStartValidation(chargeSessionID, meterStart)
        if(validationErrors.length > 0){
            callback(validationErrors, [])
        } else {
            newDataAccessLayerChargeSessions.updateMeterStart(chargeSessionID, meterStart, (error, updatedChargingSession) => {
                if (Object.keys(error).length > 0) {
                    dbErrorCheck.checkError(error, function (errorCode) {
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