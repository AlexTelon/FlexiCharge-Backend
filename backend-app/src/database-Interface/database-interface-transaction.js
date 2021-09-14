module.exports = function({ dataAccessLayerTransaction }) {

    const exports = {}

    exports.getTransaction = function(transactionID, callback){
        dataAccessLayerTransaction.getTransaction(transactionID, function(errorCodes, transaction){
            if(errorCodes.length > 0){
                callback(errorCodes, null)
            }else{
                callback([], transaction)
            }
        })
    }

    exports.getTransactionForUser = function(callback){
        dataAccessLayerTransaction.getTransactionForUser(function(errorCodes, userTransaction){
            if(errorCodes.length > 0){
                callback(errorCodes, null)
            }else{
                callback([], userTransaction)
            }
        })
    }

    exports.getTransactionForCharger = function(callback){
        dataAccessLayerTransaction.getTransactionForCharger(function(errorCodes, chargerTransaction){
            if(errorCodes.length > 0){
                callback(errorCodes, null)
            }else{
                callback([], chargerTransaction)
            }
        })
    }

    exports.addTransaction = function(transactionID, userID, chargerID, MeterStartValue, callback){
        dataAccessLayerTransaction.addTransaction(transactionID, userID, chargerID, MeterStartValue, function(errorCodes, addTransaction){ //addTransaction = bool
            if(errorCodes.length > 0){
                callback(errorCodes, null)
            }else{
                callback([], addTransaction)
            }
        })
    }

    exports.updateTransactionPayment = function(transactionID, paymentID, callback){
        dataAccessLayerTransaction.updateTransactionPayment(transactionID, paymentID, function(errorCodes, uppdateTransaction){ //uppdateTransaction = bool
            if(errorCodes.length > 0){
                callback(errorCodes, null)
            }else{
                callback([], uppdateTransaction)
            }
        })
    }

    exports.updateTransactionMeter = function(transactionID, meterValue, callback){
        dataAccessLayerTransaction.updateTransactionMeter(transactionID, meterValue, function(errorCodes, updateTransactionMeter){ //updateTransactionMeter = bool
            if(errorCodes.length > 0){
                callback(errorCodes, null)
            }else{
                callback([], updateTransactionMeter)
            }
        })
    }

    return exports
}