module.exports = function ({ dataAccessLayerChargeSessions, dataAccessLayerTransactions, databaseInterfaceElectricityTariffs, dbErrorCheck, chargeSessionValidation, ocppInterface }) {

    const exports = {}

    exports.createChargeSession = function (connectorID, userID, callback) {
        const validationErrors = chargeSessionValidation.getAddChargeSessionValidation(connectorID, userID)

        if (validationErrors.length > 0) {
            callback(validationErrors, [])
            return
        }

        dataAccessLayerChargeSessions.addChargeSession(connectorID, userID, function (error, chargeSession) {
            if (Object.keys(error).length > 0) {
                dbErrorCheck.checkError(error, function (errorCode) {
                    callback(errorCode, [])
                })
                return
            }
            callback([], chargeSession)
        })
    }

    exports.startChargeSession = function (chargeSessionID, startTime, meterStart, callback) {
        // const validationErrors = chargeSessionValidation.getAddChargeSessionValidation(connectorID, userID)

        // if (validationErrors.length > 0) {
        //     callback(validationErrors, [])
        //     return
        // }

        dataAccessLayerChargeSessions.updateMeterStart(chargeSessionID, startTime, meterStart, function (error, chargeSession) {
            if (Object.keys(error).length > 0) {
                dbErrorCheck.checkError(error, function (errorCode) {
                    callback(errorCode, [])
                })
                return
            }
            callback([], chargeSession)
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

    exports.endChargeSession = function (chargeSessionID, timestamp, kWhTransferred, callback) {
        console.debug('dis-ecs_0', chargeSessionID, timestamp, kWhTransferred)
        // const validationErrors = chargeSessionValidation.endChargeSessionValidation(chargeSessionID)
        // if (validationErrors.length > 0) { callback(validationErrors, []); return }

        dataAccessLayerChargeSessions.updateMeterStop(chargeSessionID, timestamp, kWhTransferred, function (error, chargeSession) {
            console.debug('dis-ecs_1', chargeSession)

            if (Object.keys(error).length > 0) {
                dbErrorCheck.checkError(error, function (errorCode) {
                    callback(errorCode, [], [])
                })
                return
            }

            dataAccessLayerTransactions.getTransactionForChargeSession(chargeSessionID, function (error, transaction) {
                console.debug('dis-ecs_2', transaction)

                if (Object.keys(error).length > 0) {
                    dbErrorCheck.checkError(error, function (errorCode) {
                        callback(errorCode, [], [])
                    })
                    return
                }

                // databaseInterfaceElectricityTariffs.getCurrentElectricityTariff(function (error, electricityTariff) {
                ((error, electricityTariff) => {
                    if (Object.keys(error).length > 0) {
                        dbErrorCheck.checkError(error, function (errorCode) {
                            callback(errorCode, [], [])
                        })
                        return
                    }
                    //Extend to check if the charge session has gone longer than an hour and then both hours have tariffs and a average might be good?
                    const totalPrice = Math.ceil(kWhTransferred * electricityTariff.price)
                    dataAccessLayerTransactions.updateTotalPrice(transaction.transactionID, totalPrice, function (error, updatedTransaction) {
                        if (Object.keys(error).length > 0) {
                            dbErrorCheck.checkError(error, function (errorCode) {
                                callback(errorCode, [], [])
                            })
                            return
                        }
                        callback([], updatedTransaction[1][0], chargeSession)
                    })
                })([], { price: 3.33 })
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

    return exports
}
