module.exports = function ({ newDataAccessLayerKlarna, newDataAccessLayerKlarnaPayments, newDataAccessLayerTransactions, newKlarnaPaymentsValidation }) {
    const exports = {}

    exports.getNewKlarnaPaymentSession = function (transactionID, callback) {
        newDataAccessLayerTransactions.getTransaction(transactionID, (error, transaction) => {
            if (Object.keys(error).length > 0) {
                dbErrorCheck.checkError(error, function (errorCode) {
                    callback(errorCode, [])
                })
            } else {
                if (transaction.totalPrice == null) {
                    callback(["totalPriceIsNull"], [])
                } else {
                    newDataAccessLayerKlarna.getNewKlarnaPaymentSession(transaction.totalPrice, function (error, transactionData) {
                        if (error.length == 0) {
                            const validationError = newKlarnaPaymentsValidation.addKlarnaPaymentValidation(transactionData.session_id, transactionData.client_token)
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
                }
            }
        })
    }

    exports.createKlarnaOrder = function (transactionID, authorization_token, callback) {
        newDataAccessLayerTransactions.getTransaction(transactionID, (error, transaction) => {
            if (Object.keys(error).length > 0) {
                dbErrorCheck.checkError(error, function (errorCode) {
                    callback(errorCode, [])
                })
            } else {
                newDataAccessLayerKlarna.createKlarnaOrder(transaction.totalPrice, authorization_token, function (error, klarnaOrder) {
                    if (error.length == 0) {
                        newDataAccessLayerKlarnaPayments.updateOrderID(transactionID, klarnaOrder.order_id, (error, updatedKlarnaPayment) => {
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

    exports.finalizeKlarnaOrder = function (transactionID, callback) {
        newDataAccessLayerTransactions.getTransaction(transactionID, function (error, transaction) {
            if (Object.keys(error).length > 0) {
                dbErrorCheck.checkError(error, function (errorCode) {
                    callback(errorCode, [])
                })
            } else {
                newDataAccessLayerKlarnaPayments.getKlarnaPaymentByTransactionID(transactionID, function (error, klarnaPayment) {
                    if (Object.keys(error).length > 0) {
                        dbErrorCheck.checkError(error, function (errorCode) {
                            callback(errorCode, [])
                        })
                    } else {
                        newDataAccessLayerKlarna.finalizeKlarnaOrder(transaction.totalPrice, klarnaPayment.order_id, function (error, responseData) {
                            if (error.length == 0) {
                                newDataAccessLayerTransactions.updateisPaid(transactionID, true, function (error, transaction) {
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