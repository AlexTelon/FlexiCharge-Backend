module.exports = function ({ newDataAccessLayerChargers, dbErrorCheck, newChargerValidation, newDataAccessLayerTransactions, newDataAccessLayerChargeSessions }) {

    const exports = {}

    exports.getChargers = function (database, callback) {
        newDataAccessLayerChargers.getChargers(database, function (error, chargers) {
            if (Object.keys(error).length > 0) {
                dbErrorCheck.checkError(error, function (errorCode) {
                    callback(errorCode, [])
                })
            } else {
                callback([], chargers)
            }
        })
    }

    exports.getCharger = function (chargerID, database, callback) {
        const validationErrors = newChargerValidation.getChargerValidation(chargerID)
        if (validationErrors.length > 0) {
            callback(validationErrors, [])
        } else {
            newDataAccessLayerChargers.getCharger(chargerID, database, function (error, charger) {
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

    exports.getChargerBySerialNumber = function (serialNumber, database, callback) {
        const validationErrors = newChargerValidation.getChargerBySerialNumberValidation(serialNumber)
        if (validationErrors.length > 0) {
            callback(validationErrors, [])
        } else {
            newDataAccessLayerChargers.getChargerBySerialNumber(serialNumber, database, function (error, charger) {
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


    exports.getAvailableChargers = function (database, callback) {
        newDataAccessLayerChargers.getAvailableChargers(database, function (error, chargers) {
            if (Object.keys(error).length > 0) {
                dbErrorCheck.checkError(error, function (errorCode) {
                    callback(errorCode, [])
                })
            } else {
                callback([], chargers)
            }
        })
    }

    exports.addCharger = function (chargePointID, serialNumber, coordinates, database, callback) {
        const ValidationErrors = newChargerValidation.getAddChargerValidation(coordinates, serialNumber, chargePointID)
        if (ValidationErrors.length > 0) {
            callback(ValidationErrors, [])
        } else {
            newDataAccessLayerChargers.addCharger(chargePointID, serialNumber, coordinates, database, function (error, chargerID) {
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

    exports.removeCharger = function (chargerID, database, callback) {
        const validationErrors = newChargerValidation.getRemoveChargerValidation(chargerID)
        if (validationErrors.length > 0) {
            callback(validationErrors, [])
        } else {
            newDataAccessLayerChargers.removeCharger(chargerID, database, function (error, chargerRemoved) { //chargerRemoved = bool
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


    exports.updateChargerStatus = function (chargerID, status, database, callback) {

        const validationErrors = newChargerValidation.getUpdateChargerStatusValidation(status)
        if (validationErrors.length > 0) {
            callback(validationErrors, [])
        } else {
            newDataAccessLayerChargers.updateChargerStatus(chargerID, status, database, function (error, charger) {
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

    exports.getChargerForTransaction = function (transactionID, database, callback) {
        newDataAccessLayerTransactions.getTransaction(transactionID, database, (transactionError, transaction) => {
            if (Object.keys(transactionError).length > 0) {
                dbErrorCheck.checkError(transactionError, function (errorCode) {
                    callback(errorCode, [])
                })
            } else {
                newDataAccessLayerChargeSessions.getChargeSession(transaction.chargeSessionID, database, (chargeSessionError, chargeSession) => {
                    if (Object.keys(chargeSessionError).length > 0) {
                        dbErrorCheck.checkError(chargeSessionError, function (errorCode) {
                            callback(errorCode, [])
                        })
                    } else {
                        newDataAccessLayerChargers.getCharger(chargeSession.chargerID, database, (chargerError, charger) => {
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