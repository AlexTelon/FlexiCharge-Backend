module.exports = function ({ newDataAccessLayerChargers, dbErrorCheck, newChargerValidation, newDataAccessLayerTransactions, newDataAccessLayerChargeSessions }) {

    const exports = {}

    exports.getChargers = function (callback) {
        newDataAccessLayerChargers.getChargers(function (error, chargers) {
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
        const validationErrors = newChargerValidation.getChargerValidation(chargerID)
        if (validationErrors.length > 0) {
            callback(validationErrors, [])
        } else {
            newDataAccessLayerChargers.getCharger(chargerID, function (error, charger) {
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
        const validationErrors = newChargerValidation.getChargerBySerialNumberValidation(serialNumber)
        if (validationErrors.length > 0) {
            callback(validationErrors, [])
        } else {
            newDataAccessLayerChargers.getChargerBySerialNumber(serialNumber, function (error, charger) {
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
        newDataAccessLayerChargers.getAvailableChargers(function (error, chargers) {
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
        const ValidationErrors = newChargerValidation.getAddChargerValidation(coordinates, serialNumber, chargePointID)
        if (ValidationErrors.length > 0) {
            callback(ValidationErrors, [])
        } else {
            newDataAccessLayerChargers.addCharger(chargePointID, serialNumber, coordinates, function (error, chargerID) {
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
        const validationErrors = newChargerValidation.getRemoveChargerValidation(chargerID)
        if (validationErrors.length > 0) {
            callback(validationErrors, [])
        } else {
            newDataAccessLayerChargers.removeCharger(chargerID, function (error, chargerRemoved) { //chargerRemoved = bool
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

        const validationErrors = newChargerValidation.getUpdateChargerStatusValidation(status)
        if (validationErrors.length > 0) {
            callback(validationErrors, [])
        } else {
            newDataAccessLayerChargers.updateChargerStatus(chargerID, status, function (error, charger) {
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
        newDataAccessLayerTransactions.getTransaction(transactionID, (transactionError, transaction) => {
            if (Object.keys(transactionError).length > 0) {
                dbErrorCheck.checkError(transactionError, function (errorCode) {
                    callback(errorCode, [])
                })
            } else {
                newDataAccessLayerChargeSessions.getChargeSession(transaction.chargeSessionID, (chargeSessionError, chargeSession) => {
                    if (Object.keys(chargeSessionError).length > 0) {
                        dbErrorCheck.checkError(chargeSessionError, function (errorCode) {
                            callback(errorCode, [])
                        })
                    } else {
                        newDataAccessLayerChargers.getCharger(chargeSession.chargerID, (chargerError, charger) => {
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