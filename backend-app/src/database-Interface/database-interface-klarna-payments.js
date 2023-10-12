module.exports = function ({ dataAccessLayerKlarna, dataAccessLayerKlarnaPayments, dataAccessLayerTransactions, klarnaPaymentsValidation }) {
    const exports = {}

    exports.getNewKlarnaPaymentSession = function (transactionID, callback) {
        dataAccessLayerTransactions.getTransaction(transactionID, (error, transaction) => {
            if (Object.keys(error).length > 0) {
                dbErrorCheck.checkError(error, function (errorCode) {
                    callback(errorCode, [])
                })
            } else {
                if (transaction.totalPrice == null) {
                    callback(["totalPriceIsNull"], [])
                } else {
                    dataAccessLayerKlarna.getNewKlarnaPaymentSession(transaction.totalPrice, function (error, transactionData) {
                        if (error.length == 0) {
                            const validationError = klarnaPaymentsValidation.addKlarnaPaymentValidation(transactionData.session_id, transactionData.client_token)
                            if (validationError.length > 0) {
                                callback(validationError, [])
                            } else {

                                dataAccessLayerKlarnaPayments.addKlarnaPayment(transactionData.client_token, transactionData.session_id, transaction.transactionID, (error, klarnaPayment) => {
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
        dataAccessLayerTransactions.getTransaction(transactionID, (error, transaction) => {
            if (Object.keys(error).length > 0) {
                dbErrorCheck.checkError(error, function (errorCode) {
                    callback(errorCode, [])
                })
            } else {
                dataAccessLayerKlarna.createKlarnaOrder(transaction.totalPrice, authorization_token, function (error, klarnaOrder) {
                    if (error.length == 0) {
                        dataAccessLayerKlarnaPayments.updateOrderID(transactionID, klarnaOrder.order_id, (error, updatedKlarnaPayment) => {
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
        dataAccessLayerTransactions.getTransaction(transactionID, function (error, transaction) {
            if (Object.keys(error).length > 0) {
                dbErrorCheck.checkError(error, function (errorCode) {
                    callback(errorCode, [])
                })
            } else {
                dataAccessLayerKlarnaPayments.getKlarnaPaymentByTransactionID(transactionID, function (error, klarnaPayment) {
                    if (Object.keys(error).length > 0) {
                        dbErrorCheck.checkError(error, function (errorCode) {
                            callback(errorCode, [])
                        })
                    } else {
                        dataAccessLayerKlarna.finalizeKlarnaOrder(transaction.totalPrice, klarnaPayment.order_id, function (error, responseData) {
                            if (error.length == 0) {
                                dataAccessLayerTransactions.updateisPaid(transactionID, true, function (error, transaction) {
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