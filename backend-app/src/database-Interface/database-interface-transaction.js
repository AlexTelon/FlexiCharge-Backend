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

    exports.addTransaction = function(userID, chargerID, isKlarnaPayment, currentChargePercentage, pricePerKwh, callback) {
        const validationError = transactionValidation.getAddTransactionValidation(currentChargePercentage, pricePerKwh)
        if (validationError.length > 0) {
            callback(validationError, [])
        } else {
            timestamp = (Date.now() / 1000 | 0)
            dataAccessLayerTransaction.addTransaction(userID, chargerID, isKlarnaPayment, currentChargePercentage, pricePerKwh, timestamp, function(error, transactionId) {
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
        dataAccessLayerTransaction.updateTransactionPayment(transactionID, paymentID, function(error, updatedTransactionPayment) {
            if (Object.keys(error).length > 0) {
                dbErrorCheck.checkError(error, function(errorCode) {
                    callback(errorCode, [])
                })
            } else {
                callback([], updatedTransactionPayment)
            }
        })
    }

    exports.updateTransactionKwhTransfered = function(transactionID, kwhTransfered, callback) {
        const validationError = transactionValidation.getUpdateTransactionTransferedKwhValidation(kwhTransfered)
        if (validationError.length > 0) {
            callback(validationError, [])
        } else {
            dataAccessLayerTransaction.updateTransactionKwhTransfered(transactionID, kwhTransfered, function(error, updatedKwhTransfered) {
                if (Object.keys(error).length > 0) {
                    dbErrorCheck.checkError(error, function(errorCode) {
                        callback(errorCode, [])
                    })
                } else {
                    callback([], updatedKwhTransfered)
                }
            })
        }
    }

    return exports
}