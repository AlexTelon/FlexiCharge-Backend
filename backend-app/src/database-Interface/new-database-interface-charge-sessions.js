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
                    // Not tested
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
                                    newDataAccessLayerChargeSessions.updateMeterStart(chargeSession.chargeSessionID, returnObject.meterStart, null, (error, updatedChargeSession) => {
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
        newDataAccessLayerChargeSessions.getChargeSession(chargerID, callback)
    }

    exports.updateChargingState = function (chargeSessionID, currentChargePercentage, kwhTransfered, callback) {
        const validationErrors = newChargeSessionValidation.getUpdateChargingStateValidation(currentChargePercentage, kwhTransfered)
        if (validationErrors.length > 0) {
            callback(validationErrors, [])
        } else {
            newDataAccessLayerChargeSessions.updateChargingState(chargeSessionID, currentChargePercentage, kwhTransfered, (error, updatedChargingSession) => {
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
        //TODO: VALIDATION
        endTime = (Date.now() / 1000 | 0)
        newDataAccessLayerChargeSessions.updateChargingEndTime(chargeSessionID, endTime, function (error, chargeSession) {
            if (Object.keys(error).length > 0) {
                dbErrorCheck.checkError(error, function (errorCode) {
                    callback(errorCode, [])
                })
            } else {
                newDataAccessLayerTransactions.getTransactionForChargeSession(chargeSessionID, null, function (error, transaction) {
                    if (Object.keys(error).length > 0) {
                        dbErrorCheck.checkError(error, function (errorCode) {
                            callback(errorCode, [])
                        })
                    } else {
                        ocppInterface.remoteStopTransaction(chargeSession.chargerID, transaction.transactionID, function (error, returnObject) {
                            if (error != null || returnObject.status == "Rejected") {
                                callback(["couldNotStopOCPPTransaction"])
                            } else {
                                const kwhTransfered = (returnObject.meterStop - chargeSession.meterStart) / 1000

                                if (kwhTransfered >= 0) {
                                    exports.updateChargingState(chargeSessionID, kwhTransfered, chargeSession.currentChargePercentage, function (error, updatedChargingSession) {
                                        if (Object.keys(error).length > 0) {
                                            dbErrorCheck.checkError(error, function (errorCode) {
                                                callback(errorCode, [])
                                            })
                                        } else {
                                            newDatabaseInterfaceElectricityTariffs.getCurrentElectricityTariff(null, function (error, electricityTariff) {
                                                if (Object.keys(error).length > 0) {
                                                    dbErrorCheck.checkError(error, function (errorCode) {
                                                        callback(errorCode, [])
                                                    })
                                                } else {
                                                    //Extend to check if the charge session has gone longer than an hour and then both hours have tariffs and a average might be good?
                                                    const totalPrice = chargeSession.kwhTransfered * electricityTariff.price
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

    exports.calculateTotalChargePrice = function (chargeSessionID, callback) {
        // GL & HF
        // Step 1: Get kwhTransfered, startTime and endTime
        // Step 2: Get Electricity Tariff for the hours
        // Step 3: Return total Price
        // TODO: VALIDATION
        newDataAccessLayerChargeSessions.getChargeSession(chargeSessionID, function (error, chargeSession) {
            if (Object.keys(error).length > 0) {
                dbErrorCheck.checkError(error, function (errorCode) {
                    callback(errorCode, [])
                })
            } else {
                newDataAccessLayerTransactions.getTransactionForChargeSession(chargeSession.chargeSessionID, null, function (error, transaction) {
                    if (Object.keys(error).length > 0) {
                        dbErrorCheck.checkError(error, function (errorCode) {
                            callback(errorCode, [])
                        })
                    } else {
                        newDatabaseInterfaceElectricityTariffs.getCurrentElectricityTariff(null, function (error, electricityTariff) {
                            if (Object.keys(error).length > 0) {
                                dbErrorCheck.checkError(error, function (errorCode) {
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

    exports.updateMeterStart = function (chargeSessionID, meterStart, callback) {
        // TODO Validation for updateMeterStart
        // const validationErrors = newChargeSessionValidation.getUpdateChargingStateValidation(currentChargePercentage, kwhTransfered)
        // if(validationErrors.length > 0){
        //     callback(validationErrors, [])
        // } else {

        // }

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



    return exports
}