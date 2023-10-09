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

    exports.addTransaction = function (userID, connectorID, isKlarnaPayment, pricePerKwh, callback) {
        const validationError = transactionValidation.getAddTransactionValidation(pricePerKwh)
        if (validationError.length > 0) {
            callback(validationError, [])
        } else {
            timestamp = (Date.now() / 1000 | 0);
            connectorID = connectorID;
            idTag = 1;
            parentIdTag = 1; // Optional according to OCPP
            ocppInterface.reserveNow(connectorID, idTag, parentIdTag, function (error, returnObject) {
                if (error != null || returnObject.status == "Rejected") {
                    callback(["couldNotReserveCharger"], [])
                } else {
                    dataAccessLayerTransaction.addTransaction(userID, connectorID, isKlarnaPayment, pricePerKwh, timestamp, function (error, transactionId) {
                        if (Object.keys(error).length > 0) {
                            dbErrorCheck.checkError(error, function (errorCode) {
                                callback(errorCode, [])
                            })
                        } else {
                            callback([], transactionId)
                        }
                    })
                }

            })
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
