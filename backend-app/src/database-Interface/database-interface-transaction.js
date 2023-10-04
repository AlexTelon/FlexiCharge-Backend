module.exports = function ({ dataAccessLayerTransactions, transactionValidation, dbErrorCheck }) {

    const exports = {}

    exports.addTransaction = function (chargeSessionID, userID, payNow, paymentDueDate, paymentMethod, totalPrice, callback) {
        const validationErrors = transactionValidation.getAddTransactionValidation(chargeSessionID, userID, payNow)
        if (validationErrors.length > 0) {
            callback(validationErrors, [])
        } else {
            dataAccessLayerTransactions.addTransaction(chargeSessionID, userID, payNow, paymentDueDate, paymentMethod, totalPrice, function (error, transactionID) {
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
        const validationErrors = transactionValidation.getTransactionValidation(transactionID)
        if (validationErrors.length > 0) {
            callback(validationErrors, [])
        } else {
            dataAccessLayerTransactions.getTransaction(transactionID, function (error, transaction) {
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
        const validationErrors = transactionValidation.getTransactionsForUserValidation(userID)
        if (validationErrors.length > 0) {
            callback(validationErrors, [])
        } else {
            dataAccessLayerTransactions.getTransactionsForUser(userID, function (error, userTransaction) {
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
        const validationErrors = transactionValidation.getUpdatePaymentMethodValidation(transactionID, paymentMethod)
        if (validationErrors.length > 0) {
            callback(validationErrors, [])
        } else {
            dataAccessLayerTransactions.updatePaymentMethod(transactionID, paymentMethod, function (error, transaction) {
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

    exports.updatepaidDate = function (transactionID, paidDate, callback) {
        const validationErrors = transactionValidation.getUpdatepaidDateValidation(transactionID, paidDate)
        if (validationErrors.length > 0) {
            callback(validationErrors, [])
        } else {
            dataAccessLayerTransactions.updatepaidDate(transactionID, paidDate, function (error, transaction) {
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
        const validationErrors = transactionValidation.getUpdateTotalPriceValidation(transactionID, totalPrice)
        if (validationErrors.length > 0) {
            callback(validationErrors, [])
        } else {
            dataAccessLayerTransactions.updateTotalPrice(transactionID, totalPrice, function (error, transaction) {
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
        const validationErrors = transactionValidation.getTransactionsForChargerValidation(chargerID)
        if (validationErrors.length > 0) {
            callback(validationErrors, [])
        } else {
            dataAccessLayerTransactions.getTransactionsForCharger(chargerID, function (error, chargerTransaction) {
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
        dataAccessLayerTransactions.getTransactionForChargeSession(chargeSessionID, function (error, chargeSession) {
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
