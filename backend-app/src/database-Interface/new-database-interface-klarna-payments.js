module.exports = function ({ newDataAccessLayerKlarna, newDataAccessLayerKlarnaPayments, newDataAccessLayerTransactions }) {
    const exports = {}

    exports.getNewKlarnaPaymentSession = async function (transactionID, callback) {
        newDataAccessLayerTransactions.getTransaction(transactionID, (error, transaction) => {
            newDataAccessLayerKlarna.getNewKlarnaPaymentSession(userID, chargerID, chargePoint, async function (error, transactionData) {
                if (error.length == 0) {
                    // TODO Move validation to new validation file! e.g klarnaPaymentsValidation...
                    const validationError = transactionValidation.addKlarnaTransactionValidation(transactionData.session_id, transactionData.client_token)
                    if (validationError.length > 0) {
                        callback(validationError, [])
                    } else {
                        newDataAccessLayerKlarnaPayments.addKlarnaPayment(transactionData.client_token, transactionData.session_id, transaction.transactionID, (error, klarnaPayment) => {
                            if (Object.keys(error).length > 0) {
                                dbErrorCheck.checkError(error, function (errorCode) {
                                    callback(errorCode, [])
                                })
                            } else {
                                callback([], klarnaPayment)
                            }
                        })
                    }
                } else {
                    callback(error, [])
                }
            })
        })
    }

    exports.createKlarnaOrder = async function (transactionID, authorization_token, callback) {
        newDataAccessLayerTransactions.getTransaction(transactionID, null, (error, transaction) => {
            if (Object.keys(error).length > 0) {
                dbErrorCheck.checkError(error, function (errorCode) {
                    callback(errorCode, [])
                })
            } else {
                newDataAccessLayerKlarna.createKlarnaOrder(transaction.totalPrice, authorization_token, function (error, klarnaOrder) {
                    if (error.length == 0) {
                        newDataAccessLayerKlarnaPayments.updateOrderID(transactionID, klarnaOrder.order_id, null, (error, updatedKlarnaPayment) => {
                            if (Object.keys(error).length > 0) {
                                dbErrorCheck.checkError(error, function (errorCode) {
                                    callback(errorCode, [])
                                })
                            } else {
                                callback([], updatedKlarnaPayment)
                            }
                        })
                    } else {
                        callback(error, [])
                    }
                })
            }
        })
    }

    exports.finalizeKlarnaOrder = async function (transactionID, callback) {
        newDataAccessLayerTransactions.getTransaction(transactionID, function (error, transaction) {
            if (Object.keys(error).length > 0) {
                dbErrorCheck.checkError(error, function (errorCode) {
                    callback(errorCode, [])
                })
            } else {
                newDataAccessLayerKlarnaPayments.getKlarnaPaymentByTransactionID(transactionID, function(error, klarnaPayment) {
                    if (Object.keys(error).length > 0) {
                        dbErrorCheck.checkError(error, function (errorCode) {
                            callback(errorCode, [])
                        })
                    } else {
                        newDataAccessLayerKlarna.finalizeKlarnaOrder(transaction.totalPrice, klarnaPayment.order_id, function (error, responseData) {
                            if (error.length == 0) {
                                newDataAccessLayerTransactions.updateTransactionPaymentConfirmed(transactionID, true, function (error, transaction) {
                                    if (Object.keys(error).length > 0) {
                                        dbErrorCheck.checkError(error, function (errorCode) {
                                            callback(errorCode, [])
                                        })
                                    } else {
                                        callback([], transaction)
                                    }
                                })
                            } else {
                                callback(error, [])
                            }
                        })
                    }
                })                
            }
        })
    }

    return exports
}