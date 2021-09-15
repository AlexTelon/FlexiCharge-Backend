module.exports = function({ dataAccessLayerTransaction }) {

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

    exports.getTransactionForUser = function(userID, callback) {
        dataAccessLayerTransaction.getTransactionForUser(userID, function(errorCodes, userTransaction) {
            if (errorCodes.length > 0) {
                callback(errorCodes, [])
            } else {
                callback([], userTransaction)
            }
        })
    }

    exports.getTransactionForCharger = function(chargerID, callback) {
        dataAccessLayerTransaction.getTransactionForCharger(chargerID, function(errorCodes, chargerTransaction) {
            if (errorCodes.length > 0) {
                callback(errorCodes, [])
            } else {
                callback([], chargerTransaction)
            }
        })
    }

    exports.addTransaction = function(userID, chargerID, MeterStartValue, callback) {
        dataAccessLayerTransaction.addTransaction(transactionID, userID, chargerID, MeterStartValue, function(errorCodes, transactionId) { //addTransaction = bool
            if (errorCodes.length > 0) {
                callback(errorCodes, [])
            } else {
                callback([], transactionId)
            }
        })
    }

    exports.updateTransactionPayment = function(transactionID, paymentID, callback) {
        dataAccessLayerTransaction.updateTransactionPayment(transactionID, paymentID, function(errorCodes, uppdateTransaction) { //uppdateTransaction = bool
            if (errorCodes.length > 0) {
                callback(errorCodes, [])
            } else {
                callback([], uppdateTransaction)
            }
        })
    }

    exports.updateTransactionMeter = function(transactionID, meterValue, callback) {
        dataAccessLayerTransaction.updateTransactionMeter(transactionID, meterValue, function(errorCodes, updateTransactionMeter) { //updateTransactionMeter = bool
            if (errorCodes.length > 0) {
                callback(errorCodes, [])
            } else {
                callback([], updateTransactionMeter)
            }
        })
    }

    return exports
}