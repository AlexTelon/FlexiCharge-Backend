module.exports = function ({ dataAccessLayerChargeSessions, dataAccessLayerTransactions, databaseInterfaceElectricityTariffs, dbErrorCheck, chargeSessionValidation, ocppInterface }) {

    const exports = {}

    exports.startChargeSession = function (connectorID, userID, callback) {
        const validationErrors = chargeSessionValidation.getAddChargeSessionValidation(connectorID, userID)

        if (validationErrors.length > 0) {
            callback(validationErrors, [])
            return
        }

        startTime = (Date.now() / 1000 | 0)

        dataAccessLayerChargeSessions.addChargeSession(connectorID, userID, startTime, function (error, chargeSession) {
            if (Object.keys(error).length > 0) {
                dbErrorCheck.checkError(error, function (errorCode) {
                    callback(errorCode, [])
                })
                return
            }
            else if (chargeSession.chargeSessionID) {
                dataAccessLayerChargeSessions.updateMeterStart(chargeSession.chargeSessionID, 1, function (error, updatedChargeSession) {
                    if (Object.keys(error).length > 0) {
                        dbErrorCheck.checkError(error, function (errorCode) {
                            callback(errorCode, [])
                        })
                        return
                    }
                    callback([], chargeSession)
                })
            }
        })
    }

    exports.getChargeSession = function (chargeSessionID, callback) {
        const validationErrors = chargeSessionValidation.getChargeSessionValidation(chargeSessionID)
        if (validationErrors.length > 0) { callback(validationErrors, []); return }

        dataAccessLayerChargeSessions.getChargeSession(chargeSessionID, function (error, chargeSession) {
            if (Object.keys(error).length > 0) {
                dbErrorCheck.checkError(error, function (errorCode) {
                    callback(errorCode, [])
                })
                return
            }

            if (chargeSession == null) { callback([], []); return }

            callback([], chargeSession)
        })
    }

    exports.getChargeSessions = function (connectorID, callback) {
        const validationErrors = chargeSessionValidation.getChargeSessionsValidation(connectorID)
        if (validationErrors.length > 0) {
            callback(validationErrors, [])
            return
        }

        dataAccessLayerChargeSessions.getChargeSessions(connectorID, callback)
    }

    exports.updateChargingState = function (chargeSessionID, currentChargePercentage, kWhTransferred, callback) {
        const validationErrors = chargeSessionValidation.getUpdateChargingStateValidation(currentChargePercentage, kWhTransferred)

        if (validationErrors.length > 0) {
            callback(validationErrors, [])
            return
        }

        dataAccessLayerChargeSessions.updateChargingState(chargeSessionID, currentChargePercentage, kWhTransferred, (error, updatedChargingSession) => {
            if (Object.keys(error).length > 0) {
                dbErrorCheck.checkError(error, function (errorCode) {
                    callback(errorCode, [])
                })
                return
            }

            callback([], updatedChargingSession)
        })
    }

    exports.endChargeSession = function (chargeSessionID, callback) {
        const validationErrors = chargeSessionValidation.endChargeSessionValidation(chargeSessionID)
        if (validationErrors.length > 0) { callback(validationErrors, []); return }

        endTime = (Date.now() / 1000 | 0)

        dataAccessLayerChargeSessions.updateChargingEndTime(chargeSessionID, endTime, function (error, chargeSession) {
            if (Object.keys(error).length > 0) {
                dbErrorCheck.checkError(error, function (errorCode) {
                    callback(errorCode, [])
                })
                return
            }

            dataAccessLayerTransactions.getTransactionForChargeSession(chargeSessionID, function (error, transaction) {
                if (Object.keys(error).length > 0) {
                    dbErrorCheck.checkError(error, function (errorCode) {
                        callback(errorCode, [])
                    })
                    return
                }

                ocppInterface.remoteStopTransaction(chargeSession.connectorID, transaction.transactionID, function (error, returnObject) {
                    if (error != null || returnObject.status == "Rejected") {
                        callback(["couldNotStopOCPPTransaction"], [])
                        return
                    }

                    const kWhTransferred = (returnObject.meterStop - chargeSession.meterStart) / 1000

                    if (kWhTransferred < 0) {
                        callback(["couldNotStopOCPPTransaction"], [])
                        return
                    }

                    dataAccessLayerChargeSessions.updateChargingState(chargeSessionID, chargeSession.currentChargePercentage, kWhTransferred, function (error, updatedChargingSession) {
                        if (Object.keys(error).length > 0) {
                            dbErrorCheck.checkError(error, function (errorCode) {
                                callback(errorCode, [])
                            })
                            return
                        }

                        databaseInterfaceElectricityTariffs.getCurrentElectricityTariff(function (error, electricityTariff) {
                            if (Object.keys(error).length > 0) {
                                dbErrorCheck.checkError(error, function (errorCode) {
                                    callback(errorCode, [])
                                })
                                return
                            }
                            //Extend to check if the charge session has gone longer than an hour and then both hours have tariffs and a average might be good?
                            const totalPrice = chargeSession.kWhTransferred * electricityTariff.price
                            dataAccessLayerTransactions.updateTotalPrice(transaction.transactionID, totalPrice, function (error, updatedTransaction) {
                                if (Object.keys(error).length > 0) {
                                    dbErrorCheck.checkError(error, function (errorCode) {
                                        callback(errorCode, [])
                                    })
                                    return
                                }
                                callback([], updatedChargingSession)
                            })
                        })
                    })
                })
            })
        })
    }

    exports.calculateTotalChargePrice = function (chargeSessionID, callback) {
        const validationErrors = chargeSessionValidation.calculateTotalChargePriceValidation(chargeSessionID)
        if (validationErrors.length > 0) { callback(validationErrors, []); return }

        dataAccessLayerChargeSessions.getChargeSession(chargeSessionID, function (error, chargeSession) {
            if (Object.keys(error).length > 0) {
                dbErrorCheck.checkError(error, function (errorCode) {
                    callback(errorCode, [])
                })
                return
            }

            dataAccessLayerTransactions.getTransactionForChargeSession(chargeSession.chargeSessionID, function (error, transaction) {
                if (Object.keys(error).length > 0) {
                    dbErrorCheck.checkError(error, function (errorCode) {
                        callback(errorCode, [])
                    })
                    return
                }

                databaseInterfaceElectricityTariffs.getCurrentElectricityTariff(function (error, electricityTariff) {
                    if (Object.keys(error).length > 0) {
                        dbErrorCheck.checkError(error, function (errorCode) {
                            callback(errorCode, [])
                        })
                        return
                    }

                    const price = chargeSession.kWhTransferred * electricityTariff.price
                    callback([], price)
                })
            })
        })
    }

    exports.updateMeterStart = function (chargeSessionID, meterStart, callback) {
        const validationErrors = chargeSessionValidation.updateMeterStartValidation(chargeSessionID, meterStart)
        if (validationErrors.length > 0) { callback(validationErrors, []); return }

        dataAccessLayerChargeSessions.updateMeterStart(chargeSessionID, meterStart, (error, updatedChargingSession) => {
            if (Object.keys(error).length > 0) {
                dbErrorCheck.checkError(error, function (errorCode) {
                    callback(errorCode, [])
                })
                return
            }
            callback([], updatedChargingSession)
        })
    }

    return exports
}
