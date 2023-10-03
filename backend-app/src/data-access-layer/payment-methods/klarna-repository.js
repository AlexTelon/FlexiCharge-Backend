const https = require('https')

module.exports = function({}) {
    const KLARNA_URI = "api.playground.klarna.com"
    const exports = {}

    exports.getNewKlarnaPaymentSession = async function(totalPrice, callback) {

        if (totalPrice > 0) {
            const data = new TextEncoder().encode(
                JSON.stringify({
                    "purchase_country": "SE",
                    "purchase_currency": "SEK",
                    "locale": "sv-SE",
                    "order_amount": totalPrice,
                    "order_tax_amount": 0,
                    "order_lines": getOrderLines(totalPrice)
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
                        const responseData = JSON.parse(jsonResponse);
                        callback([], responseData)
                    })
                } else {
                    switch (result.statusCode) {
                        case 400: // 	We were unable to create a session with the provided data. Some field constraint was violated.
                            callback(["klarnaUnableToCreateSession"], [])
                            break;
                        case 403: // 	You were not authorized to execute this operation.
                            callback(["klarnaNotAuthorized"], [])
                            break;
                        default:
                            callback(["klarnaError"], [])
                    }
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

    exports.createKlarnaOrder = async function(totalPrice, authorization_token, callback) {
        const data = new TextEncoder().encode(
            JSON.stringify({
                "purchase_country": "SE",
                "purchase_currency": "SEK",
                "status": "CHECKOUT_INCOMPLETE",
                "order_amount": totalPrice,
                "order_tax_amount": 0,
                "order_lines": getOrderLines(totalPrice)
            })
        )

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
                result.on('data', jsonKlarnaOrder => {
                    const klarnaOrder = JSON.parse(jsonKlarnaOrder);
                    callback([], klarnaOrder)
                })
            } else {
                switch (result.statusCode) {
                    case 400: //	We were unable to create an order with the provided data. Some field constraint was violated.
                        callback(["klarnaUnableToCreateOrder"], [])
                        break
                    case 401: //	You were not authorized to execute this operation.
                        callback(["klarnaNotAuthorized"], [])
                        break
                    case 404: // The authorization does not exist.
                        callback(["klarnaNotAuthorized"], [])
                        break
                    case 409: // The data in the request does not match the session for the authorization.
                        callback(["klarnaInvalidDataInRequest"], [])
                        break
                    default:
                        callback(["klarnaError"], [])
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

    exports.finalizeKlarnaOrder = async function(totalPrice, order_id, callback) {
        const newOrderAmount = Math.round(transaction.pricePerKwh * transaction.kWhTransferred);
        const order_lines = getOrderLines(newOrderAmount)

        updateOrder(totalPrice, order_id, order_lines, function(error, responseData) {
            if (error.length == 0) {
                captureOrder(totalPrice, order_id, function(error) {
                    if (error.length == 0) {
                        callback([], responseData) //capture does not response with anything so we callback the response data from the update.
                    } else {
                        callback(error, [])
                    }
                })
            } else {
                callback(error, [])
            }
        })
    }

    function updateOrder(totalPrice, order_id, order_lines, callback) {
        const data = new TextEncoder().encode(
            JSON.stringify({
                "purchase_country": "SE",
                "purchase_currency": "SEK",
                "locale": "sv-SE",
                "order_tax_amount": 0,
                "order_lines": order_lines,
                "order_amount": totalPrice
            })
        )

        const options = {
            hostname: KLARNA_URI,
            port: 443,
            path: "/ordermanagement/v1/orders/" + order_id + "/authorization",
            method: "PATCH",
            headers: {
                "Authorization": "Basic " + Buffer.from("PK44810_1f4977848b52" + ":" + "AcYW9rvNuy2YpZgX").toString("base64"),
                "Content-Type": "application/json"
            }
        }

        const request = https.request(options, result => {
            if (result.statusCode == 204) {
                callback([], [])
            } else {
                switch (result.statusCode) {
                    case 400: //We were unable to update an order with the provided data. Some field constraint was violated.
                        callback(["klarnaUnableToUpdateOrder"], [])
                        break
                    case 401: //You were not authorized to execute this operation.
                        callback(["klarnaNotAuthorized"], [])
                        break
                    case 403: //You tried to modify a read only resource.
                        callback(["klarnaNotAuthorized"], [])
                        break;
                    case 404: //We did not find any order with given ID. You need to create a new order.
                        callback(["klarnaOrderNotFound"], [])
                        break;
                    default:
                        callback(["klarnaError"], [])
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

    function captureOrder(totalPrice, order_id, callback) {
        const captureData = new TextEncoder().encode(
            JSON.stringify({
                "captured_amount": totalPrice
            })
        )

        const captureOptions = {
            hostname: KLARNA_URI,
            port: 443,
            path: "/ordermanagement/v1/orders/" + order_id + "/captures",
            method: "POST",
            headers: {
                "Authorization": "Basic " + Buffer.from("PK44810_1f4977848b52" + ":" + "AcYW9rvNuy2YpZgX").toString("base64"),
                "Content-Type": "application/json"
            }
        }

        const request = https.request(captureOptions, result => {
            if (result.statusCode == 201) {
                callback([])
            } else {
                switch (result.statusCode) {
                    case 403: // Capture not allowed.
                        callback(["klarnaCaptureNotAllowed"], [])
                        break;
                    case 404: // 	Order not found.
                        callback(["klarnaOrderNotFound"], [])
                        break;
                    default:
                        callback(["klarnaError"], [])
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

    function getOrderLines(totalPrice) {
        const order_lines = [{
            "type": "digital",
            "name": "Electrical Vehicle Charging",
            "quantity": 1,
            "unit_price": totalPrice,
            "tax_rate": 0,
            "total_amount": totalPrice,
            "total_discount_amount": 0,
            "total_tax_amount": 0
        }]

        return order_lines

    }
    return exports
}