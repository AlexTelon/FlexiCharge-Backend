module.exports = function ({ dataAccessLayerTransactions, transactionValidation, dbErrorCheck }) {

    const exports = {}

    exports.addTransaction = function (chargeSessionID, userID, payNow, paymentDueDate, paymentMethod, totalPrice, callback) {
        const validationErrors = transactionValidation.getAddTransactionValidation(chargeSessionID, userID, payNow)
        if (validationErrors.length > 0) {
            callback(validationErrors, [])
            return
        }
        dataAccessLayerTransactions.addTransaction(chargeSessionID, userID, payNow, paymentDueDate, paymentMethod, totalPrice, function (error, transactionID) {
            if (Object.keys(error).length > 0) {
                dbErrorCheck.checkError(error, function (errorCode) {
                    callback(errorCode, [])
                })
                return
            }
            callback([], transactionID)
        })
    }

    exports.getTransaction = function (transactionID, callback) {
        const validationErrors = transactionValidation.getTransactionValidation(transactionID)
        if (validationErrors.length > 0) {
            callback(validationErrors, [])
            return
        }
        dataAccessLayerTransactions.getTransaction(transactionID, function (error, transaction) {
            if (Object.keys(error).length > 0) {
                dbErrorCheck.checkError(error, function (errorCode) {
                    callback(errorCode, [])
                })
                return
            }
            if (transaction == null) {
                callback([], [])
                return
            }
            callback([], transaction)
        })
    }

    exports.getTransactionsForUser = function (userID, callback) {
        const validationErrors = transactionValidation.getTransactionsForUserValidation(userID)
        if (validationErrors.length > 0) {
            callback(validationErrors, [])
            return
        }
        dataAccessLayerTransactions.getTransactionsForUser(userID, function (error, userTransaction) {
            if (Object.keys(error).length > 0) {
                dbErrorCheck.checkError(error, function (errorCode) {
                    callback(errorCode, [])
                })
                return
            }
            callback([], userTransaction)
        })
    }

    exports.updatePaymentMethod = function (transactionID, paymentMethod, callback) {
        const validationErrors = transactionValidation.getUpdatePaymentMethodValidation(transactionID, paymentMethod)
        if (validationErrors.length > 0) {
            callback(validationErrors, [])
            return
        }
        dataAccessLayerTransactions.updatePaymentMethod(transactionID, paymentMethod, function (error, transaction) {
            if (Object.keys(error).length > 0) {
                dbErrorCheck.checkError(error, function (errorCode) {
                    callback(errorCode, [])
                })
                return
            }
            callback([], transaction)
        })
    }

    exports.updatepaidDate = function (transactionID, paidDate, callback) {
        const validationErrors = transactionValidation.getUpdatepaidDateValidation(transactionID, paidDate)
        if (validationErrors.length > 0) {
            callback(validationErrors, [])
            return
        }
        dataAccessLayerTransactions.updatepaidDate(transactionID, paidDate, function (error, transaction) {
            if (Object.keys(error).length > 0) {
                dbErrorCheck.checkError(error, function (errorCode) {
                    callback(errorCode, [])
                })
                return
            }
            callback([], transaction)
        })
    }

    exports.updateTotalPrice = function (transactionID, totalPrice, callback) {
        const validationErrors = transactionValidation.getUpdateTotalPriceValidation(transactionID, totalPrice)
        if (validationErrors.length > 0) {
            callback(validationErrors, [])
            return
        }
        dataAccessLayerTransactions.updateTotalPrice(transactionID, totalPrice, function (error, transaction) {
            if (Object.keys(error).length > 0) {
                dbErrorCheck.checkError(error, function (errorCode) {
                    callback(errorCode, [])
                })
                return
            }
            callback([], transaction)
        })
    }

    exports.getTransactionsForCharger = function (connectorID, callback) {
        const validationErrors = transactionValidation.getTransactionsForChargerValidation(connectorID)
        if (validationErrors.length > 0) {
            callback(validationErrors, [])
            return
        }
        dataAccessLayerTransactions.getTransactionsForCharger(connectorID, function (error, chargerTransaction) {
            if (Object.keys(error).length > 0) {
                dbErrorCheck.checkError(error, function (errorCode) {
                    callback(errorCode, [])
                })
                return
            }
            callback([], chargerTransaction)
        })
    }

    exports.getTransactionForChargeSession = function (chargeSessionID, callback) {
        dataAccessLayerTransactions.getTransactionForChargeSession(chargeSessionID, function (error, chargeSession) {
            if (Object.keys(error).length > 0) {
                dbErrorCheck.checkError(error, function (errorCode) {
                    callback(errorCode)
                })
                return
            }
            callback([], chargeSession)
        })
    }

    return exports
}
