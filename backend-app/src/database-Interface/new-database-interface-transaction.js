module.exports = function({ newDataAccessLayerTransactions, transactionValidation, dbErrorCheck, dataAccessLayerCharger, dataAccessLayerChargePoint, dataAccessLayerKlarna, ocppInterface }) {

    const exports = {}

    exports.addTransaction = function(chargeSessionID, userID, payNow, paymentDueDate, database, callback) {
        newDataAccessLayerTransactions.addTransaction(chargeSessionID, userID, payNow, paymentDueDate, database, function(error, transactionId) {
            if (Object.keys(error).length > 0) {
                dbErrorCheck.checkError(error, function(errorCode) {
                    callback(errorCode, [])
                })
            } else {
                callback([], transactionId)
            }
        })
        
    }

    exports.getTransaction = function(transactionID, database, callback) {
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

    exports.getTransactionsForUser = function(userID, database, callback) {
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

    exports.updatePaymentMethod = function(transactionID, paymentMethod, database, callback) {
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
    // TODO Maybe merge : updateIsPayed, updatePayedDate, updateTotalPrice to one field. 
    exports.updatePayedDate = function(transactionID, payedDate, database, callback) {
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

    exports.updateTotalPrice = function(transactionID, totalPrice, database, callback) {
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

    exports.getTransactionsForCharger = function(chargerID, database, callback) {
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

    // TODO Klarna methods should be moved to new Klarna Payment interface...
    // exports.getNewKlarnaPaymentSession = async function(userID, chargerID, callback) {

    //     dataAccessLayerCharger.getCharger(chargerID, async function(error, charger) {
    //         if (Object.keys(error).length > 0) {
    //             dbErrorCheck.checkError(error, function(errorCode) {
    //                 callback(errorCode, [])
    //             })
    //         } else {
    //             if (charger != null) {
    //                 dataAccessLayerChargePoint.getChargePoint(charger.chargePointID, async function(error, chargePoint) {
    //                     if (Object.keys(error).length > 0) {
    //                         dbErrorCheck.checkError(error, function(errorCode) {
    //                             callback(errorCode, [])
    //                         })
    //                     } else {
    //                         dataAccessLayerKlarna.getNewKlarnaPaymentSession(userID, chargerID, chargePoint, async function(error, transactionData) {
    //                             if (error.length == 0) {
    //                                 const validationError = transactionValidation.addKlarnaTransactionValidation(transactionData.session_id, transactionData.client_token)
    //                                 if (validationError.length > 0) {
    //                                     callback(validationError, [])
    //                                 } else {
    //                                     const paymentConfirmed = false
    //                                     const isKlarnaPayment = true
    //                                     const timestamp = (Date.now() / 1000 | 0)

    //                                     newDataAccessLayerTransactions.addKlarnaTransaction(userID, chargerID, chargePoint.price, transactionData.session_id, transactionData.client_token, isKlarnaPayment, timestamp, paymentConfirmed, function(error, klarnaTransaction) {
    //                                         if (Object.keys(error).length > 0) {
    //                                             dbErrorCheck.checkError(error, function(error) {
    //                                                 callback(error, [])
    //                                             })
    //                                         } else {
    //                                             callback([], klarnaTransaction)
    //                                         }
    //                                     })
    //                                 }
    //                             } else {
    //                                 callback(error, [])
    //                             }
    //                         })
    //                     }
    //                 })
    //             } else {
    //                 callback(["invalidChargerId"], [])
    //             }
    //         }
    //     })
    // }

    // exports.createKlarnaOrder = async function(transactionId, authorization_token, callback) {

    //     newDataAccessLayerTransactions.getTransaction(transactionId, function(error, transaction) {
    //         if (Object.keys(error).length > 0) {
    //             dbErrorCheck.checkError(error, function(errorCode) {
    //                 callback(errorCode, [])
    //             })
    //         } else {
    //             dataAccessLayerCharger.getCharger(transaction.chargerID, function(error, charger) {
    //                 if (Object.keys(error).length > 0) {
    //                     dbErrorCheck.checkError(error, function(errorCode) {
    //                         callback(errorCode, [])
    //                     })
    //                 } else {
    //                     dataAccessLayerChargePoint.getChargePoint(charger.chargePointID, async function(error, chargePoint) {
    //                         if (Object.keys(error).length > 0) {
    //                             dbErrorCheck.checkError(error, function(errorCode) {
    //                                 callback(errorCode, [])
    //                             })
    //                         } else {
    //                             dataAccessLayerKlarna.createKlarnaOrder(transactionId, chargePoint.klarnaReservationAmount, authorization_token, function(error, klarnaOrder) {
    //                                 if (error.length == 0) {
    //                                     newDataAccessLayerTransactions.updateTransactionPayment(transactionId, klarnaOrder.order_id, function(error, updatedTransaction) {
    //                                         if (Object.keys(error).length > 0) {
    //                                             dbErrorCheck.checkError(error, function(errorCode) {
    //                                                 callback(errorCode, [])
    //                                             })
    //                                         } else {
    //                                             ocppInterface.remoteStartTransaction(charger.chargerID, transactionId, function(error, returnObject) {
    //                                                 if(error != null || returnObject.status == "Rejected") {
    //                                                     callback(["couldNotStartOCPPTransaction"], [])
    //                                                 } else {
    //                                                     newDataAccessLayerTransactions.updateTransactionMeterStart(transactionId, returnObject.meterStart, function(error, updatedTransaction) {
    //                                                         if (Object.keys(error).length > 0) {
    //                                                             dbErrorCheck.checkError(error, function(errorCode) {
    //                                                                 callback(errorCode, [])
    //                                                             })
    //                                                         } else {
    //                                                             callback([], updatedTransaction)
    //                                                         }
    //                                                     })
    //                                                 }
    //                                             })
    //                                         }
    //                                     })
    //                                 } else {
    //                                     callback(error, [])
    //                                 }
    //                             })
    //                         }
    //                     })
    //                 }
    //             })
    //         }
    //     })
    // }

    // exports.finalizeKlarnaOrder = async function(transactionId, callback) {

    //     newDataAccessLayerTransactions.getTransaction(transactionId, function(error, transaction) {
    //         if (Object.keys(error).length > 0) {
    //             dbErrorCheck.checkError(error, function(errorCode) {
    //                 callback(errorCode, [])
    //             })
    //         } else {
    //             dataAccessLayerCharger.getCharger(transaction.chargerID, function(error, charger) {
    //                 if (Object.keys(error).length > 0) {
    //                     dbErrorCheck.checkError(error, function(errorCode) {
    //                         callback(errorCode, [])
    //                     })
    //                 } else {
    //                     dataAccessLayerChargePoint.getChargePoint(charger.chargePointID, async function(error, chargePoint) {
    //                         if (Object.keys(error).length > 0) {
    //                             dbErrorCheck.checkError(error, function(errorCode) {
    //                                 callback(errorCode, [])
    //                             })
    //                         } else {
    //                             ocppInterface.remoteStopTransaction(charger.chargerID, transactionId, function(error, returnObject) {
    //                                 if(error != null || returnObject.status == "Rejected") {
    //                                     callback(["couldNotStopOCPPTransaction"])
    //                                 } else {
    //                                     newDataAccessLayerTransactions.getTransaction(transactionId, function(error, transaction){
    //                                         if (Object.keys(error).length > 0) {
    //                                             dbErrorCheck.checkError(error, function(errorCode) {
    //                                                 callback(errorCode, [])
    //                                             })
    //                                         } else {
    //                                             const kwhTransfered = (returnObject.meterStop - transaction.meterStart) / 1000

    //                                             if(kwhTransfered >= 0) {
    //                                                 newDataAccessLayerTransactions.updateTransactionChargingStatus(transactionId, kwhTransfered, transaction.currentChargePercentage, function(error, updatedTransaction) {
    //                                                     if (Object.keys(error).length > 0) {
    //                                                         dbErrorCheck.checkError(error, function(errorCode) {
    //                                                             callback(errorCode, [])
    //                                                         })
    //                                                     } else {
    //                                                         dataAccessLayerKlarna.finalizeKlarnaOrder(transaction, transactionId, function(error, responseData) {
    //                                                             if (error.length == 0) {
    //                                                                 newDataAccessLayerTransactions.updateTransactionPaymentConfirmed(transactionId, true, function(error, transaction) {
    //                                                                     if (Object.keys(error).length > 0) {
    //                                                                         dbErrorCheck.checkError(error, function(errorCode) {
    //                                                                             callback(errorCode, [])
    //                                                                         })
    //                                                                     } else {
    //                                                                         callback([], transaction)
    //                                                                     }
    //                                                                 })
    //                                                             } else {
    //                                                                 callback(error, [])
    //                                                             }
                        
    //                                                         })
    //                                                     }
    //                                                 })
    //                                             } else {
    //                                                 callback(["couldNotStopOCPPTransaction"], [])
    //                                             }
    //                                         }
    //                                     })
    //                                 }
    //                             })
    //                         }
    //                     })
    //                 }
    //             })
    //         }
    //     })
    // }

    return exports
}
