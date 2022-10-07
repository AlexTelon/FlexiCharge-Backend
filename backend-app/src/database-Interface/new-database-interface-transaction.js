module.exports = function ({ newDataAccessLayerTransactions, newTransactionValidation, dbErrorCheck }) {

    const exports = {}

    exports.addTransaction = function (chargeSessionID, userID, payNow, paymentDueDate, paymentMethod, totalPrice, callback) {
        const validationErrors = newTransactionValidation.getAddTransactionValidation(chargeSessionID, userID, payNow)
        if (validationErrors.length > 0) {
            callback(validationErrors, [])
        } else {
            newDataAccessLayerTransactions.addTransaction(chargeSessionID, userID, payNow, paymentDueDate, paymentMethod, totalPrice, function (error, transactionID) {
                if (Object.keys(error).length > 0) {
                    dbErrorCheck.checkError(error, function (errorCode) {
                        callback(errorCode, [])
                    })
                } else {
                    callback([], transactionID)
                }
            })
        }
    }

    exports.getTransaction = function (transactionID, callback) {
        const validationErrors = newTransactionValidation.getTransactionValidation(transactionID)
        if (validationErrors.length > 0) {
            callback(validationErrors, [])
        } else {
            newDataAccessLayerTransactions.getTransaction(transactionID, function (error, transaction) {
                if (Object.keys(error).length > 0) {
                    dbErrorCheck.checkError(error, function (errorCode) {
                        callback(errorCode, [])
                    })
                } else {
                    if (transaction == null) {
                        callback([], [])
                    } else {
                        callback([], transaction)
                    }
                }
            })
        }
    }

    exports.getTransactionsForUser = function (userID, callback) {
        const validationErrors = newTransactionValidation.getTransactionsForUserValidation(userID)
        if (validationErrors.length > 0) {
            callback(validationErrors, [])
        } else {
            newDataAccessLayerTransactions.getTransactionsForUser(userID, function (error, userTransaction) {
                if (Object.keys(error).length > 0) {
                    dbErrorCheck.checkError(error, function (errorCode) {
                        callback(errorCode, [])
                    })
                } else {
                    callback([], userTransaction)
                }
            })
        }
    }

    exports.updatePaymentMethod = function (transactionID, paymentMethod, callback) {
        const validationErrors = newTransactionValidation.getUpdatePaymentMethodValidation(transactionID, paymentMethod)
        if (validationErrors.length > 0) {
            callback(validationErrors, [])
        } else {
            newDataAccessLayerTransactions.updatePaymentMethod(transactionID, paymentMethod, function (error, transaction) {
                if (Object.keys(error).length > 0) {
                    dbErrorCheck.checkError(error, function (errorCode) {
                        callback(errorCode, [])
                    })
                } else {
                    callback([], transaction)
                }
            })
        }
    }

    exports.updatePayedDate = function (transactionID, payedDate, callback) {
        const validationErrors = newTransactionValidation.getUpdatePayedDateValidation(transactionID, payedDate)
        if (validationErrors.length > 0) {
            callback(validationErrors, [])
        } else {
            newDataAccessLayerTransactions.updatePayedDate(transactionID, payedDate, function (error, transaction) {
                if (Object.keys(error).length > 0) {
                    dbErrorCheck.checkError(error, function (errorCode) {
                        callback(errorCode, [])
                    })
                } else {
                    callback([], transaction)
                }
            })
        }
    }

    exports.updateTotalPrice = function (transactionID, totalPrice, callback) {
        const validationErrors = newTransactionValidation.getUpdateTotalPriceValidation(transactionID, totalPrice)
        if (validationErrors.length > 0) {
            callback(validationErrors, [])
        } else {
            newDataAccessLayerTransactions.updateTotalPrice(transactionID, totalPrice, function (error, transaction) {
                if (Object.keys(error).length > 0) {
                    dbErrorCheck.checkError(error, function (errorCode) {
                        callback(errorCode, [])
                    })
                } else {
                    callback([], transaction)
                }
            })
        }
    }

    exports.getTransactionsForCharger = function (chargerID, callback) {
        const validationErrors = newTransactionValidation.getTransactionsForChargerValidation(chargerID)
        if (validationErrors.length > 0) {
            callback(validationErrors, [])
        } else {
            newDataAccessLayerTransactions.getTransactionsForCharger(chargerID, function (error, chargerTransaction) {
                if (Object.keys(error).length > 0) {
                    dbErrorCheck.checkError(error, function (errorCode) {
                        callback(errorCode, [])
                    })
                } else {
                    callback([], chargerTransaction)
                }
            })
        }
    }

    exports.getTransactionForChargeSession = function (chargeSessionID, callback) {
        newDataAccessLayerTransactions.getTransactionForChargeSession(chargeSessionID, function (error, chargeSession) {
            if (Object.keys(error).length > 0) {
                dbErrorCheck.checkError(error, function (errorCode) {
                    callback(errorCode)
                })
            } else {
                callback([], chargeSession)
            }
        })
    }

    return exports
}
