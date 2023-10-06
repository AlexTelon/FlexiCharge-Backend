module.exports = function ({ dataAccessLayerChargeSessions, dataAccessLayerTransactions, databaseInterfaceElectricityTariffs, dbErrorCheck, chargeSessionValidation, ocppInterface }) {

    const exports = {}

    exports.startChargeSession = function (chargerID, userID, payNow, paymentDueDate, paymentMethod, callback) {
        const validationErrors = chargeSessionValidation.getAddChargeSessionValidation(chargerID, userID)
        if (validationErrors.length > 0) {
            callback(validationErrors, [])
        } else {
            startTime = (Date.now() / 1000 | 0)
            dataAccessLayerChargeSessions.addChargeSession(chargerID, userID, startTime, function (error, chargeSession) {
                if (Object.keys(error).length > 0) {
                    dbErrorCheck.checkError(error, function (errorCode) {
                        callback(errorCode, [])
                    })
                } else {
                    // When chargeSession is added, it's started. Which in turn:
                    // 1. Creates a new transaction
                    // 2. Contacts OCPP interface and starts the remoteTransaction
                    totalPrice = null
                    dataAccessLayerTransactions.addTransaction(chargeSession.chargeSessionID, userID, payNow, paymentDueDate, paymentMethod, totalPrice, function (error, transaction) {
                        if (Object.keys(error).length > 0) {
                            dbErrorCheck.checkError(error, function (errorCode) {
                                callback(errorCode, [])
                            })
                        } else {
                            ocppInterface.remoteStartTransaction(chargeSession.chargerID, transaction.transactionID, function (error, returnObject) {
                                if (error != null || returnObject.status == "Rejected") {
                                    callback(["couldNotStartOCPPTransaction"], [])
                                } else {
                                    dataAccessLayerChargeSessions.updateMeterStart(chargeSession.chargeSessionID, returnObject.meterStart, (error, updatedChargeSession) => {
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
        const validationErrors = chargeSessionValidation.getChargeSessionValidation(chargeSessionID)
        if (validationErrors.length > 0) {
            callback(validationErrors, [])
        } else {
            dataAccessLayerChargeSessions.getChargeSession(chargeSessionID, function (error, chargeSession) {
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
        const validationErrors = chargeSessionValidation.getChargeSessionsValidation(chargerID)
        if (validationErrors.length > 0) {
            callback(validationErrors, [])
        } else {
            dataAccessLayerChargeSessions.getChargeSessions(chargerID, callback)
        }
    }

    exports.updateChargingState = function (chargeSessionID, currentChargePercentage, kWhTransferred, callback) {
        const validationErrors = chargeSessionValidation.getUpdateChargingStateValidation(currentChargePercentage, kWhTransferred)
        if (validationErrors.length > 0) {
            callback(validationErrors, [])
        } else {
            dataAccessLayerChargeSessions.updateChargingState(chargeSessionID, currentChargePercentage, kWhTransferred, (error, updatedChargingSession) => {
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
        const validationErrors = chargeSessionValidation.endChargeSessionValidation(chargeSessionID)
        if (validationErrors.length > 0) {
            callback(validationErrors, [])
        } else {
            endTime = (Date.now() / 1000 | 0)
            dataAccessLayerChargeSessions.updateChargingEndTime(chargeSessionID, endTime, function (error, chargeSession) {
                if (Object.keys(error).length > 0) {
                    dbErrorCheck.checkError(error, function (errorCode) {
                        callback(errorCode, [])
                    })
                } else {
                    dataAccessLayerTransactions.getTransactionForChargeSession(chargeSessionID, function (error, transaction) {
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
                                        dataAccessLayerChargeSessions.updateChargingState(chargeSessionID, chargeSession.currentChargePercentage, kWhTransferred, function (error, updatedChargingSession) {
                                            if (Object.keys(error).length > 0) {
                                                dbErrorCheck.checkError(error, function (errorCode) {
                                                    callback(errorCode, [])
                                                })
                                            } else {
                                                databaseInterfaceElectricityTariffs.getCurrentElectricityTariff(function (error, electricityTariff) {
                                                    if (Object.keys(error).length > 0) {
                                                        dbErrorCheck.checkError(error, function (errorCode) {
                                                            callback(errorCode, [])
                                                        })
                                                    } else {
                                                        //Extend to check if the charge session has gone longer than an hour and then both hours have tariffs and a average might be good?
                                                        const totalPrice = chargeSession.kWhTransferred * electricityTariff.price
                                                        dataAccessLayerTransactions.updateTotalPrice(transaction.transactionID, totalPrice, function (error, updatedTransaction) {
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
        const validationErrors = chargeSessionValidation.calculateTotalChargePriceValidation(chargeSessionID)
        if (validationErrors.length > 0) {
            callback(validationErrors, [])
        } else {
            dataAccessLayerChargeSessions.getChargeSession(chargeSessionID, function (error, chargeSession) {
                if (Object.keys(error).length > 0) {
                    dbErrorCheck.checkError(error, function (errorCode) {
                        callback(errorCode, [])
                    })
                } else {
                    dataAccessLayerTransactions.getTransactionForChargeSession(chargeSession.chargeSessionID, function (error, transaction) {
                        if (Object.keys(error).length > 0) {
                            dbErrorCheck.checkError(error, function (errorCode) {
                                callback(errorCode, [])
                            })
                        } else {
                            databaseInterfaceElectricityTariffs.getCurrentElectricityTariff(function (error, electricityTariff) {
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
        const validationErrors = chargeSessionValidation.updateMeterStartValidation(chargeSessionID, meterStart)
        if(validationErrors.length > 0){
            callback(validationErrors, [])
        } else {
            dataAccessLayerChargeSessions.updateMeterStart(chargeSessionID, meterStart, (error, updatedChargingSession) => {
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