module.exports = function({ newDataAccessLayerTransactions, newTransactionValidation, dbErrorCheck}) {

    const exports = {}

    exports.addTransaction = function(chargeSessionID, userID, payNow, paymentDueDate, paymentMethod, totalPrice, database, callback) {
        const validationErrors = newTransactionValidation.getAddTransactionValidation(chargeSessionID, userID, payNow)
        if(validationErrors.length > 0){
            callback(validationErrors, [])
        } else {
            newDataAccessLayerTransactions.addTransaction(chargeSessionID, userID, payNow, paymentDueDate, paymentMethod, totalPrice, database, function(error, transactionID) {
                if (Object.keys(error).length > 0) {
                    dbErrorCheck.checkError(error, function(errorCode) {
                        callback(errorCode, [])
                    })
                } else {
                    callback([], transactionID)
                }
            })
        }
    }

    exports.getTransaction = function(transactionID, database, callback) {
        const validationErrors = newTransactionValidation.getTransactionValidation(transactionID)
        if(validationErrors.length > 0){
            callback(validationErrors, [])
        } else {
            newDataAccessLayerTransactions.getTransaction(transactionID, database, function(error, transaction) {
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
    }

    exports.getTransactionsForUser = function(userID, database, callback) {
        const validationErrors = newTransactionValidation.getTransactionsForUserValidation(userID)
        if(validationErrors.length > 0){
            callback(validationErrors, [])
        } else {
            newDataAccessLayerTransactions.getTransactionsForUser(userID, database, function(error, userTransaction) {
                if (Object.keys(error).length > 0) {
                    dbErrorCheck.checkError(error, function(errorCode) {
                        callback(errorCode, [])
                    })
                } else {
                    callback([], userTransaction)
                }
            })
        }
    }

    exports.updatePaymentMethod = function(transactionID, paymentMethod, database, callback) {
        const validationErrors = newTransactionValidation.getUpdatePaymentMethodValidation(transactionID, paymentMethod)
        if(validationErrors.length > 0){
            callback(validationErrors, [])
        } else {
            newDataAccessLayerTransactions.updatePaymentMethod(transactionID, paymentMethod, database, function(error, transaction) {
                if (Object.keys(error).length > 0) {
                    dbErrorCheck.checkError(error, function(errorCode) {
                        callback(errorCode, [])
                    })
                } else {
                    callback([], transaction)
                }
            })
        }
    } 
    
    exports.updatePayedDate = function(transactionID, payedDate, database, callback) {
        const validationErrors = newTransactionValidation.getUpdatePayedDateValidation(transactionID, payedDate)
        if(validationErrors.length > 0){
            callback(validationErrors, [])
        } else {
            newDataAccessLayerTransactions.updatePayedDate(transactionID, payedDate, database, function(error, transaction) {
                if (Object.keys(error).length > 0) {
                    dbErrorCheck.checkError(error, function(errorCode) {
                        callback(errorCode, [])
                    })
                } else {
                    callback([], transaction)
                }
            })
        }
    } 

    exports.updateTotalPrice = function(transactionID, totalPrice, database, callback) {
        const validationErrors = newTransactionValidation.getUpdateTotalPriceValidation(transactionID, totalPrice)
        if(validationErrors.length > 0){
            callback(validationErrors, [])
        } else {
            newDataAccessLayerTransactions.updateTotalPrice(transactionID, totalPrice, database, function(error, transaction) {
                if (Object.keys(error).length > 0) {
                    dbErrorCheck.checkError(error, function(errorCode) {
                        callback(errorCode, [])
                    })
                } else {
                    callback([], transaction)
                }
            })
        }
    } 

    exports.getTransactionsForCharger = function(chargerID, database, callback) {
        const validationErrors = newTransactionValidation.getTransactionsForChargerValidation(chargerID)
        if(validationErrors.length > 0){
            callback(validationErrors, [])
        } else {
            newDataAccessLayerTransactions.getTransactionsForCharger(chargerID, database, function(error, chargerTransaction) {
                if (Object.keys(error).length > 0) {
                    dbErrorCheck.checkError(error, function(errorCode) {
                        callback(errorCode, [])
                    })
                } else {
                    callback([], chargerTransaction)
                }
            })
        }
    }

    exports.getTransactionForChargeSession = function(chargeSessionID, database, callback){
        newDataAccessLayerTransactions.getTransactionForChargeSession(chargeSessionID, database, function(error, chargeSession){
            if(Object.keys(error).length > 0){
                dbErrorCheck.checkError(error, function(errorCode){
                    callback(errorCode)
                })
            } else {
                callback([], chargeSession)
            }
        })
    }

    return exports
}
