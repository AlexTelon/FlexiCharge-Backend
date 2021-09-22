module.exports = function({ dataAccessLayerTransaction,transactionValidation, dbErrorCheck }) {


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

    exports.addTransaction = function(userID, chargerID, MeterStartValue, callback) {
        const validationError = transactionValidation.getAddTransactionValidation(MeterStartValue)
        if(validationError.length > 0){
            callback(validationError, [])
        }else{
            timestamp = (Date.now() / 1000 | 0)
          dataAccessLayerTransaction.addTransaction(userID, chargerID, MeterStartValue, timestamp, function(error, transactionId) {
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

    exports.updateTransactionMeter = function(transactionID, meterValue, callback) {
        const validationError = transactionValidation.getUpdateTransactionMeterValidation(meterValue)
        if(validationError.length > 0){
            callback(validationError, [])
        }else{
           dataAccessLayerTransaction.updateTransactionMeter(transactionID, meterValue, function(error, updatedTransactionMeter) {
            if (Object.keys(error).length > 0) {
                dbErrorCheck.checkError(error, function(errorCode) {
                    callback(errorCode, [])
                })
            } else {
                callback([], updatedTransactionMeter)
            }
        })
        }
    }

    return exports
}