const https = require('https')

module.exports = function({ dataAccessLayerTransaction }) {
    const KLARNA_URI = "api.playground.klarna.com"
    const exports = {}

    exports.getNewKlarnaPaymentSession = async function(userID, chargerID, chargePoint, order_lines, callback) {

        if (chargePoint.klarnaReservationAmount > 0) {
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
                    "Authorization": "Basic " + Buffer.from("PK44810_1f4977848b52" + ":" + "AcYW9rvNuy2YpZgX").toString("base64"),
                    "Content-Type": "application/json"
                }
            }

            const request = https.request(options, result => {
                if (result.statusCode == 200) {
                    result.on('data', jsonResponse => {
                        responseData = JSON.parse(jsonResponse);
                        addKlarnaTransaction(userID, chargerID, chargePoint.price, responseData.session_id, responseData.client_token, responseData.payment_method_categories, function(error, transaction) {
                            if (error.length > 0) {
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

    exports.createKlarnaOrder = async function(transactionId, authorization_token, order_lines, billing_address, shipping_address, callback) { //TODO, THIS FUNCTION IS ONLY A START AND NEEDS TO BE IMPROVED AND TESTED
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
                "Authorization": "Basic " + Buffer.from("PK44810_1f4977848b52" + ":" + "AcYW9rvNuy2YpZgX").toString("base64"),
                "Content-Type": "application/json"
            }
        }

        const request = https.request(options, result => {
            if (result.statusCode == 200) {
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


    exports.finalizeKlarnaOrder = async function(transaction, transactionId, order_lines, callback) {

        // TODO: Update the klarna order with the correct amount and capture it.

        updateOrder(transaction, function(error, responseData) {

            if (error.length == 0) {
                callback([], responseData)
                captureOrder(transaction, function(error, capturedData) {
                    if (error.length == 0) {
                        callback([], capturedData)
                    } else {
                        callback(error, [])
                    }
                })
            } else {
                callback(error, [])
            }
        })

    }

    function updateOrder(transaction, callback) {

        const data = new TextEncoder().encode(
            JSON.stringify({
                //"purchase_country": "SE",
                //"purchase_currency": "SEK",
                //"locale": "sv-SE",
                //"order_tax_amount": 0,
                //"order_lines": order_lines,
                "order_amount": (transaction.pricePerKwh * transaction.kwhTransfered)
            })
        )
        console.log(Buffer.from(data).toString());

        const options = {
            hostname: KLARNA_URI,
            port: 443,
            path: "/checkout/v3/orders/" + transaction.paymentID,
            method: "POST",
            headers: {
                "Authorization": "Basic " + Buffer.from("PK44810_1f4977848b52" + ":" + "AcYW9rvNuy2YpZgX").toString("base64"),
                "Content-Type": "application/json"
            }
        }

        const request = https.request(options, result => {
            if (result.statusCode == 200) {
                result.on('data', jsonResponse => {
                    responseData = JSON.parse(jsonResponse);
                    callback([], [responseData])
                })
            } else {
                switch (result.statusCode) {
                    case 400: //We were unable to update an order with the provided data. Some field constraint was violated.
                        callback(["klarnaError400"], [])
                        break
                    case 401: //You were not authorized to execute this operation.
                        callback(["klarnaError401"], [])
                        break
                    case 403: //You tried to modify a read only resource.
                        callback(["klarnaError403"], [])
                        break;
                    case 404: //We did not find any order with given ID. You need to create a new order.
                        callback(["klarnaError404"], [])
                        break;
                }
            }
        })

        request.on('error', error => {
            console.log(error)
            callback(["klarnaError"], [])
        })

        request.write(data)
        request.end()

    }

    function captureOrder(transaction, callback) {

        const captureData = new TextEncoder().encode(
            JSON.stringify({
                "captured_amount": (transaction.pricePerKwh * transaction.kwhTransfered)
            })
        )
        console.log(Buffer.from(captureData).toString());

        const captureOptions = {
            hostname: KLARNA_URI,
            port: 443,
            path: "/ordermanagement/v1/orders/{order_id}/captures",
            method: "POST",
            headers: {
                "Authorization": "Basic " + Buffer.from("PK44810_1f4977848b52" + ":" + "AcYW9rvNuy2YpZgX").toString("base64"),
                "Content-Type": "application/json"
            }
        }

        const request = https.request(captureOptions, result => {
            if (result.statusCode == 200) {
                result.on('data', jsonResponse => {
                    responseData = JSON.parse(jsonResponse);
                    callback([], [responseData])
                })
            } else {
                switch (result.statusCode) {
                    case 400: //We were unable to update an order with the provided data. Some field constraint was violated.
                        callback(["klarnaError400"], [])
                        break
                    case 401: //You were not authorized to execute this operation.
                        callback(["klarnaError401"], [])
                        break
                    case 403: //You tried to modify a read only resource.
                        callback(["klarnaError403"], [])
                        break;
                    case 404: //We did not find any order with given ID. You need to create a new order.
                        callback(["klarnaError404"], [])
                        break;
                }
            }
        })

        request.on('error', error => {
            console.log(error)
            callback(["klarnaError"], [])
        })

        request.write(captureData)
        request.end()
    }



    function addKlarnaTransaction(userID, chargerID, pricePerKwh, session_id, client_token, payment_method_categories, callback) {
        const paymentConfirmed = false
        const isKlarnaPayment = true
        const timestamp = (Date.now() / 1000 | 0)

        dataAccessLayerTransaction.addKlarnaTransaction(userID, chargerID, pricePerKwh, session_id, client_token, payment_method_categories, isKlarnaPayment, timestamp, paymentConfirmed, function(error, klarnaTransaction) {
            if (Object.keys(error).length > 0) {
                dbErrorCheck.checkError(error, function(error) {
                    callback(error, [])
                })
            } else {
                callback([], klarnaTransaction)
            }
        })
    }





    return exports
}