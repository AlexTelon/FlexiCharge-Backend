module.exports = function({ dataAccessLayerTransaction, transactionValidation }) {

    const exports = {}

    exports.getTransaction = function(transactionID, callback) {
        dataAccessLayerTransaction.getTransaction(transactionID, function(errorCodes, transaction) {
            if (errorCodes.length > 0) {
                callback(errorCodes, [])
            } else {
                callback([], transaction)
            }
        })
    }

    exports.getTransactionsForUser = function(userID, callback) {
        dataAccessLayerTransaction.getTransactionsForUser(userID, function(errorCodes, userTransaction) {
            if (errorCodes.length > 0) {
                callback(errorCodes, [])
            } else {
                callback([], userTransaction)
            }
        })
    }

    exports.getTransactionsForCharger = function(chargerID, callback) {
        dataAccessLayerTransaction.getTransactionsForCharger(chargerID, function(errorCodes, chargerTransaction) {
            if (errorCodes.length > 0) {
                callback(errorCodes, [])
            } else {
                callback([], chargerTransaction)
            }
        })
    }

    exports.addTransaction = function(userID, chargerID, MeterStartValue, callback) {
        const validationError = transactionValidation.getAddTransactionValidation(MeterStartValue)
        if(validationError.length > 0){
            callback(validationError, null)
        }else{
            timestamp = (Date.now() / 1000 | 0)
            dataAccessLayerTransaction.addTransaction(userID, chargerID, MeterStartValue, timestamp, function(errorCodes, transactionId) {
                if (errorCodes.length > 0) {
                    callback(errorCodes, [])
                } else {
                    callback([], transactionId)
                }
            })
        }
    }

    exports.updateTransactionPayment = function(transactionID, paymentID, callback) {
        dataAccessLayerTransaction.updateTransactionPayment(transactionID, paymentID, function(errorCodes, updatedTransaction) {
            if (errorCodes.length > 0) {
                callback(errorCodes, [])
            } else {
                callback([], updatedTransaction)
            }
        })
    }

    exports.updateTransactionMeter = function(transactionID, meterValue, callback) {
        const validationError = transactionValidation.getUpdateTransactionMeterValidation(meterValue)
        if(validationError.length > 0){
            callback(validationError, null)
        }else{
            dataAccessLayerTransaction.updateTransactionMeter(transactionID, meterValue, function(errorCodes, updatedTransaction) {
                if (errorCodes.length > 0) {
                    callback(errorCodes, [])
                } else {
                    callback([], updatedTransaction)
                }
            })
        }
    }

    return exports
}