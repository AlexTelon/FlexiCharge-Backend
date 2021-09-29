module.exports = function({ dataAccessLayerTransaction, transactionValidation, dbErrorCheck }) {

    const exports = {}

    exports.getTransaction = function(transactionID, callback) {
        dataAccessLayerTransaction.getTransaction(transactionID, function(error, transaction) {
            if (Object.keys(error).length > 0) {
                dbErrorCheck.checkError(error, function(errorCode) {
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

    exports.getTransactionsForUser = function(userID, callback) {
        dataAccessLayerTransaction.getTransactionsForUser(userID, function(error, userTransaction) {
            if (Object.keys(error).length > 0) {
                dbErrorCheck.checkError(error, function(errorCode) {
                    callback(errorCode, [])
                })
            } else {
                callback([], userTransaction)
            }
        })
    }

    exports.getTransactionsForCharger = function(chargerID, callback) {
        dataAccessLayerTransaction.getTransactionsForCharger(chargerID, function(error, chargerTransaction) {
            if (Object.keys(error).length > 0) {
                dbErrorCheck.checkError(error, function(errorCode) {
                    callback(errorCode, [])
                })
            } else {
                callback([], chargerTransaction)
            }
        })
    }

    exports.addTransaction = function(userID, chargerID, isKlarnaPayment, pricePerKwh, callback) {
        const validationError = transactionValidation.getAddTransactionValidation(pricePerKwh)
        if (validationError.length > 0) {
            callback(validationError, [])
        } else {
            timestamp = (Date.now() / 1000 | 0)
            dataAccessLayerTransaction.addTransaction(userID, chargerID, isKlarnaPayment, pricePerKwh, timestamp, function(error, transactionId) {
                if (Object.keys(error).length > 0) {
                    dbErrorCheck.checkError(error, function(errorCode) {
                        callback(errorCode, [])
                    })
                } else {
                    callback([], transactionId)
                }
            })
        }
    }

    exports.updateTransactionPayment = function(transactionID, paymentID, callback) {
        dataAccessLayerTransaction.updateTransactionPayment(transactionID, paymentID, function(error, updatedTransaction) {
            if (Object.keys(error).length > 0) {
                dbErrorCheck.checkError(error, function(errorCode) {
                    callback(errorCode, [])
                })
            } else {
                callback([], updatedTransaction)
            }
        })
    }

    exports.updateTransactionChargingStatus = function(transactionID, kwhTransfered, currentChargePercentage, callback) {
        const validationError = transactionValidation.getUpdateTransactionChargingStatus(kwhTransfered, currentChargePercentage)
        if (validationError.length > 0) {
            callback(validationError, [])
        } else {
            dataAccessLayerTransaction.updateTransactionChargingStatus(transactionID, kwhTransfered, currentChargePercentage, function(error, updatedTransaction) {
                if (Object.keys(error).length > 0) {
                    dbErrorCheck.checkError(error, function(errorCode) {
                        callback(errorCode, [])
                    })
                } else {
                    callback([], updatedTransaction)
                }
            })
        }
    }

    return exports
}