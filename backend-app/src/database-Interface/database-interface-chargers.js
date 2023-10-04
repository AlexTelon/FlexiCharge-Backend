module.exports = function ({ dataAccessLayerChargers, dbErrorCheck, chargerValidation, dataAccessLayerTransactions, dataAccessLayerChargeSessions }) {

    const exports = {}

    exports.getChargers = function (callback) {
        dataAccessLayerChargers.getChargers(function (error, chargers) {
            if (Object.keys(error).length > 0) {
                dbErrorCheck.checkError(error, function (errorCode) {
                    callback(errorCode, [])
                })
            } else {
                callback([], chargers)
            }
        })
    }

    exports.getCharger = function (chargerID, callback) {
        const validationErrors = chargerValidation.getChargerValidation(chargerID)
        if (validationErrors.length > 0) {
            callback(validationErrors, [])
        } else {
            dataAccessLayerChargers.getCharger(chargerID, function (error, charger) {
                if (Object.keys(error).length > 0) {
                    dbErrorCheck.checkError(error, function (errorCode) {
                        callback(errorCode, [])
                    })
                } else {
                    if (charger == null) {
                        callback([], [])
                    } else {
                        callback([], charger)
                    }
                }
            })
        }
    }

    exports.getChargerBySerialNumber = function (serialNumber, callback) {
        const validationErrors = chargerValidation.getChargerBySerialNumberValidation(serialNumber)
        if (validationErrors.length > 0) {
            callback(validationErrors, [])
        } else {
            dataAccessLayerChargers.getChargerBySerialNumber(serialNumber, function (error, charger) {
                if (Object.keys(error).length > 0) {
                    dbErrorCheck.checkError(error, function (errorCode) {
                        callback(errorCode, [])
                    })
                } else {
                    if (charger == null) {
                        callback([], [])
                    } else {
                        callback([], charger)
                    }

                }
            })
        }
    }


    exports.getAvailableChargers = function (callback) {
        dataAccessLayerChargers.getAvailableChargers(function (error, chargers) {
            if (Object.keys(error).length > 0) {
                dbErrorCheck.checkError(error, function (errorCode) {
                    callback(errorCode, [])
                })
            } else {
                callback([], chargers)
            }
        })
    }

    exports.addCharger = function (chargePointID, serialNumber, coordinates, callback) {
        const ValidationErrors = chargerValidation.getAddChargerValidation(coordinates, serialNumber, chargePointID)
        if (ValidationErrors.length > 0) {
            callback(ValidationErrors, [])
        } else {
            dataAccessLayerChargers.addCharger(chargePointID, serialNumber, coordinates, function (error, chargerID) {
                if (Object.keys(error).length > 0) {
                    dbErrorCheck.checkError(error, function (errorCode) {
                        callback(errorCode, [])
                    })
                } else {
                    callback([], chargerID)
                }
            })
        }
    }

    exports.removeCharger = function (chargerID, callback) {
        const validationErrors = chargerValidation.getRemoveChargerValidation(chargerID)
        if (validationErrors.length > 0) {
            callback(validationErrors, [])
        } else {
            dataAccessLayerChargers.removeCharger(chargerID, function (error, chargerRemoved) { //chargerRemoved = bool
                if (Object.keys(error).length > 0) {
                    dbErrorCheck.checkError(error, function (errorCode) {
                        callback(errorCode, chargerRemoved)
                    })
                } else {
                    callback([], chargerRemoved)
                }
            })
        }
    }


    exports.updateChargerStatus = function (chargerID, status, callback) {

        const validationErrors = chargerValidation.getUpdateChargerStatusValidation(status)
        if (validationErrors.length > 0) {
            callback(validationErrors, [])
        } else {
            dataAccessLayerChargers.updateChargerStatus(chargerID, status, function (error, charger) {
                if (Object.keys(error).length > 0) {
                    dbErrorCheck.checkError(error, function (errorCode) {
                        callback(errorCode, [])
                    })
                } else {
                    callback([], charger)
                }
            })
        }
    }

    exports.getChargerForTransaction = function (transactionID, callback) {
        dataAccessLayerTransactions.getTransaction(transactionID, (transactionError, transaction) => {
            if (Object.keys(transactionError).length > 0) {
                dbErrorCheck.checkError(transactionError, function (errorCode) {
                    callback(errorCode, [])
                })
            } else {
                dataAccessLayerChargeSessions.getChargeSession(transaction.chargeSessionID, (chargeSessionError, chargeSession) => {
                    if (Object.keys(chargeSessionError).length > 0) {
                        dbErrorCheck.checkError(chargeSessionError, function (errorCode) {
                            callback(errorCode, [])
                        })
                    } else {
                        dataAccessLayerChargers.getCharger(chargeSession.chargerID, (chargerError, charger) => {
                            if (Object.keys(chargerError).length > 0) {
                                dbErrorCheck.checkError(chargerError, function (errorCode) {
                                    callback(errorCode, [])
                                })
                            } else {
                                callback([], charger)
                            }
                        })
                    }

                })
            }
        })
    }

    return exports
}