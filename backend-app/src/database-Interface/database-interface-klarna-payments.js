module.exports = function({ dataAccessLayerKlarna, newDataAccessLayerTransactions, newDataAccessLayerChargePoints }) {
    const exports = {}

    exports.getNewKlarnaPaymentSession = async function(userID, chargerID, callback) {
        newDataAccessLayerChargePoints.getCharger(chargerID, null, async function(error, charger) {
            if (Object.keys(error).length > 0) {
                dbErrorCheck.checkError(error, function(errorCode) {
                    callback(errorCode, [])
                })
            } else {
                if (charger != null) {
                    newDataAccessLayerChargePoints.getChargePoint(charger.chargePointID, null, async function(error, chargePoint) {
                        if (Object.keys(error).length > 0) {
                            dbErrorCheck.checkError(error, function(errorCode) {
                                callback(errorCode, [])
                            })
                        } else {
                            dataAccessLayerKlarna.getNewKlarnaPaymentSession(userID, chargerID, chargePoint, async function(error, transactionData) {
                                if (error.length == 0) {
                                    const validationError = transactionValidation.addKlarnaTransactionValidation(transactionData.session_id, transactionData.client_token)
                                    if (validationError.length > 0) {
                                        callback(validationError, [])
                                    } else {
                                        const paymentConfirmed = false
                                        const isKlarnaPayment = true
                                        const timestamp = (Date.now() / 1000 | 0)

                                        newDataAccessLayerTransactions.addKlarnaTransaction(userID, chargerID, chargePoint.price, transactionData.session_id, transactionData.client_token, isKlarnaPayment, timestamp, paymentConfirmed, function(error, klarnaTransaction) {
                                            if (Object.keys(error).length > 0) {
                                                dbErrorCheck.checkError(error, function(error) {
                                                    callback(error, [])
                                                })
                                            } else {
                                                callback([], klarnaTransaction)
                                            }
                                        })
                                    }
                                } else {
                                    callback(error, [])
                                }
                            })
                        }
                    })
                } else {
                    callback(["invalidChargerID"], [])
                }
            }
        })
    }

    exports.createKlarnaOrder = async function(transactionID, authorization_token, callback) {

        newDataAccessLayerTransactions.getTransaction(transactionID, function(error, transaction) {
            if (Object.keys(error).length > 0) {
                dbErrorCheck.checkError(error, function(errorCode) {
                    callback(errorCode, [])
                })
            } else {
                dataAccessLayerCharger.getCharger(transaction.chargerID, function(error, charger) {
                    if (Object.keys(error).length > 0) {
                        dbErrorCheck.checkError(error, function(errorCode) {
                            callback(errorCode, [])
                        })
                    } else {
                        dataAccessLayerChargePoint.getChargePoint(charger.chargePointID, async function(error, chargePoint) {
                            if (Object.keys(error).length > 0) {
                                dbErrorCheck.checkError(error, function(errorCode) {
                                    callback(errorCode, [])
                                })
                            } else {
                                dataAccessLayerKlarna.createKlarnaOrder(transactionID, chargePoint.klarnaReservationAmount, authorization_token, function(error, klarnaOrder) {
                                    if (error.length == 0) {
                                        newDataAccessLayerTransactions.updateTransactionPayment(transactionID, klarnaOrder.order_id, function(error, updatedTransaction) {
                                            if (Object.keys(error).length > 0) {
                                                dbErrorCheck.checkError(error, function(errorCode) {
                                                    callback(errorCode, [])
                                                })
                                            } else {
                                                ocppInterface.remoteStartTransaction(charger.chargerID, transactionID, function(error, returnObject) {
                                                    if(error != null || returnObject.status == "Rejected") {
                                                        callback(["couldNotStartOCPPTransaction"], [])
                                                    } else {
                                                        newDataAccessLayerTransactions.updateTransactionMeterStart(transactionID, returnObject.meterStart, function(error, updatedTransaction) {
                                                            if (Object.keys(error).length > 0) {
                                                                dbErrorCheck.checkError(error, function(errorCode) {
                                                                    callback(errorCode, [])
                                                                })
                                                            } else {
                                                                callback([], updatedTransaction)
                                                            }
                                                        })
                                                    }
                                                })
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
        })
    }

    exports.finalizeKlarnaOrder = async function(transactionID, callback) {

        newDataAccessLayerTransactions.getTransaction(transactionID, function(error, transaction) {
            if (Object.keys(error).length > 0) {
                dbErrorCheck.checkError(error, function(errorCode) {
                    callback(errorCode, [])
                })
            } else {
                dataAccessLayerCharger.getCharger(transaction.chargerID, function(error, charger) {
                    if (Object.keys(error).length > 0) {
                        dbErrorCheck.checkError(error, function(errorCode) {
                            callback(errorCode, [])
                        })
                    } else {
                        dataAccessLayerChargePoint.getChargePoint(charger.chargePointID, async function(error, chargePoint) {
                            if (Object.keys(error).length > 0) {
                                dbErrorCheck.checkError(error, function(errorCode) {
                                    callback(errorCode, [])
                                })
                            } else {
                                ocppInterface.remoteStopTransaction(charger.chargerID, transactionID, function(error, returnObject) {
                                    if(error != null || returnObject.status == "Rejected") {
                                        callback(["couldNotStopOCPPTransaction"])
                                    } else {
                                        newDataAccessLayerTransactions.getTransaction(transactionID, function(error, transaction){
                                            if (Object.keys(error).length > 0) {
                                                dbErrorCheck.checkError(error, function(errorCode) {
                                                    callback(errorCode, [])
                                                })
                                            } else {
                                                const kwhTransfered = (returnObject.meterStop - transaction.meterStart) / 1000

                                                if(kwhTransfered >= 0) {
                                                    newDataAccessLayerTransactions.updateTransactionChargingStatus(transactionID, kwhTransfered, transaction.currentChargePercentage, function(error, updatedTransaction) {
                                                        if (Object.keys(error).length > 0) {
                                                            dbErrorCheck.checkError(error, function(errorCode) {
                                                                callback(errorCode, [])
                                                            })
                                                        } else {
                                                            dataAccessLayerKlarna.finalizeKlarnaOrder(transaction, transactionID, function(error, responseData) {
                                                                if (error.length == 0) {
                                                                    newDataAccessLayerTransactions.updateTransactionPaymentConfirmed(transactionID, true, function(error, transaction) {
                                                                        if (Object.keys(error).length > 0) {
                                                                            dbErrorCheck.checkError(error, function(errorCode) {
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
                                                } else {
                                                    callback(["couldNotStopOCPPTransaction"], [])
                                                }
                                            }
                                        })
                                    }
                                })
                            }
                        })
                    }
                })
            }
        })
    }

    return exports
}