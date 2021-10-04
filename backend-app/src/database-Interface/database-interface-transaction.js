const https = require('https')

module.exports = function({ dataAccessLayerTransaction, transactionValidation, dbErrorCheck, dataAccessLayerCharger, dataAccessLayerChargePoint }) {

    const KLARNA_URI = "api.playground.klarna.com"
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

    exports.addTransaction = function(userID, chargerID, isKlarnaPayment, pricePerKwh, callback) {
        const validationError = transactionValidation.getAddTransactionValidation(pricePerKwh)
        if (validationError.length > 0) {
            callback(validationError, [])
        } else {
            timestamp = (Date.now() / 1000 | 0)
            dataAccessLayerTransaction.addTransaction(userID, chargerID, isKlarnaPayment, pricePerKwh, timestamp, function(error, transactionId) {
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

    function addKlarnaTransaction(userID, chargerID, pricePerKwh, session_id, client_token, payment_method_categories, callback){
        const paymentConfirmed = false
        const isKlarnaPayment = true
        const timestamp = (Date.now() / 1000 | 0)

        dataAccessLayerTransaction.addKlarnaTransaction(userID, chargerID, pricePerKwh, session_id, client_token, payment_method_categories, isKlarnaPayment, timestamp, paymentConfirmed, function(error, klarnaTransaction){
            if (Object.keys(error).length > 0) {
                dbErrorCheck.checkError(error, function(errorCode) {
                    callback(errorCode, [])
                })
            } else {
                callback([], klarnaTransaction)
            }
        })
    }

    exports.updateTransactionPayment = function(transactionID, paymentID, callback) {
        dataAccessLayerTransaction.updateTransactionPayment(transactionID, paymentID, function(error, updatedTransaction) {
            if (Object.keys(error).length > 0) {
                dbErrorCheck.checkError(error, function(errorCode) {
                    callback(errorCode, [])
                })
            } else {
                callback([], updatedTransaction)
            }
        })
    }

    exports.updateTransactionChargingStatus = function(transactionID, kwhTransfered, currentChargePercentage, callback) {
        const validationError = transactionValidation.getUpdateTransactionChargingStatus(kwhTransfered, currentChargePercentage)
        if (validationError.length > 0) {
            callback(validationError, [])
        } else {
            dataAccessLayerTransaction.updateTransactionChargingStatus(transactionID, kwhTransfered, currentChargePercentage, function(error, updatedTransaction) {
                if (Object.keys(error).length > 0) {
                    dbErrorCheck.checkError(error, function(errorCode) {
                        callback(errorCode, [])
                    })
                } else {
                    dataAccessLayerCharger.getCharger(updatedTransaction.chargerID, function(error, charger){
                        if (Object.keys(error).length > 0) {
                            dbErrorCheck.checkError(error, function(errorCode) {
                                callback(errorCode, [])
                            })
                        } else {
                            dataAccessLayerChargePoint.getChargePoint(charger.chargePointID, function(error, chargePoint){
                                if (Object.keys(error).length > 0) {
                                    dbErrorCheck.checkError(error, function(errorCode) {
                                        callback(errorCode, [])
                                    })
                                } else {
                                    if(updatedTransaction.pricePerKwh * kwhTransfered >= chargePoint.klarnaReservationAmount) {
                                        //TODO: STOP CHARGING HERE
                                    } else {
                                        callback([], updatedTransaction)
                                    }
                                }
                            })
                        }
                    })
                    
                }
            })
        }
    }

    exports.getNewKlarnaPaymentSession = async function(userID, chargerID, order_lines, callback) {
        dataAccessLayerCharger.getCharger(chargerID, async function(error, charger){
            if (Object.keys(error).length > 0) {
                dbErrorCheck.checkError(error, function(errorCode) {
                    callback(errorCode, [])
                })
            } else {
                dataAccessLayerChargePoint.getChargePoint(1, async function(error, chargePoint){ //TODO: Change hardcoded 1 to charger.chargePointID
                    if (Object.keys(error).length > 0) {
                        dbErrorCheck.checkError(error, function(errorCode) {
                            callback(errorCode, [])
                        })
                    } else {
                        if(chargePoint.klarnaReservationAmount > 0) {
                            const data = new TextEncoder().encode(
                                JSON.stringify({
                                    "purchase_country": "SE",
                                    "purchase_currency": "SEK",
                                    "locale": "sv-SE",
                                    "order_amount": chargePoint.klarnaReservationAmount,
                                    "order_tax_amount": 0,
                                    "order_lines": order_lines
                                })
                            )
                            console.log(Buffer.from(data).toString());

                            const options = {
                                hostname: KLARNA_URI,
                                port: 443,
                                path: "/payments/v1/sessions",
                                method: "POST",
                                headers: {
                                    "Authorization": "Basic " + Buffer.from("PK44810_1f4977848b52"+":"+"AcYW9rvNuy2YpZgX").toString("base64"),
                                    "Content-Type": "application/json"
                                }
                            }
                            
                            const request = https.request(options, result => {
                                if(result.statusCode == 200) {
                                    result.on('data', jsonResponse => {
                                        responseData = JSON.parse(jsonResponse);

                                        addKlarnaTransaction(userID, chargerID, chargePoint.price, responseData.session_id, responseData.client_token, responseData.payment_method_categories, function(error, transaction){
                                            if(error.length > 0) {
                                                callback(error, [])
                                            } else {
                                                callback([], transaction.dataValues)
                                            }
                                        })
                                    })
                                } else {
                                    callback(["klarnaError"], [])
                                }
                            })

                            request.on('error', error => {
                                console.log(error)
                                callback(["klarnaError"], [])
                            })

                            request.write(data)
                            request.end()
                        } else {
                            callback(["dbError"], [])
                        }
                    }
                })
            }
        })
    }

    exports.createKlarnaOrder = function(transactionId, authorization_token, order_lines, billing_address, shipping_address) { //TODO, THIS FUNCTION IS ONLY A START AND NEEDS TO BE IMPROVED AND TESTED
        const data = new TextEncoder().encode(
            JSON.stringify({
                "purchase_country": "SE",
                "purchase_currency": "SEK",
                "status": "CHECKOUT_INCOMPLETE",
                "order_amount": chargePoint.klarnaReservationAmount,
                "order_tax_amount": 0,
                "order_lines": order_lines,
                "billing_address": billing_address,
                "shipping_address": shipping_address,
            })
        )
        console.log(Buffer.from(data).toString());

        const options = {
            hostname: KLARNA_URI,
            port: 443,
            path: `/payments/v1/authorizations/${authorization_token}/order`,
            method: "POST",
            headers: {
                "Authorization": "Basic " + Buffer.from("PK44810_1f4977848b52"+":"+"AcYW9rvNuy2YpZgX").toString("base64"),
                "Content-Type": "application/json"
            }
        }
        
        const request = https.request(options, result => {
            if(result.statusCode == 200) {
                result.on('data', responseData => {
                    //TODO: Send back that order was created succesfully
                    
                    process.stdout.write(d)
                })
            } else {
                callback(["klarnaError"], [])
            }
        })

        request.on('error', error => {
            console.log(error)
            callback(["klarnaError"], [])
        })

        request.write(data)
        request.end()
    }

    exports.finalizeKlarnaOrder = function(transactionId, callback) {
        dataAccessLayerTransaction.getTransaction(transactionId, function(error, transaction){
            if (Object.keys(error).length > 0) {
                dbErrorCheck.checkError(error, function(errorCode) {
                    callback(errorCode, [])
                })
            } else {
                // TODO: Update the klarna order with the correct amount and capture it.
            }
        })
    }

    return exports
}