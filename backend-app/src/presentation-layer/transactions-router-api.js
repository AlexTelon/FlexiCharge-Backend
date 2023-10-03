var express = require('express')
const AuthMiddleware = require('./middleware/auth.middleware')
const authenticate = new AuthMiddleware().verifyToken;

module.exports = function ({ newDatabaseInterfaceTransactions }) {

    function getMockTransaction() {
        return {
            "transactionID": 9999,
            "isKlarnaPayment": false,
            "kwhTransfered": Math.floor(Math.random() * 100) + 1, // Random number between 0 and 100
            "currentChargePercentage": Math.floor(Math.random() * 101), // Random number between 0 and 100
            "pricePerKwh": (Math.random() * 100).toFixed(2), // Random number between 0 and 100 with 2 decimal places
            "timestamp": Date.now(),
            "paymentID": null,
            "userID": "1",
            "session_id": null,
            "client_token": null,
            "paymentConfirmed": null,
            "meterStart": 1,
            "chargerID": 100000
        };
    }

        const transactionId = request.params.id
        newDatabaseInterfaceTransactions.getTransaction(transactionId, function (errors, transaction) {
            if (errors.length == 0 && transaction.length == 0) {
                response.status(404).end()
            } else if (errors.length == 0) {
                response.status(200).json(transaction)
            } else {
                response.status(500).json(errors)
            }
        })
    

    router.get('/userTransactions/:userID', function (request, response) {

        const userId = request.params.userID
        newDatabaseInterfaceTransactions.getTransactionsForUser(userId, function (errors, userTransaction) {
            if (errors.length == 0 && userTransaction.length == 0) {
                response.status(404).end()
            } else if (errors.length == 0) {
                response.status(200).json(userTransaction)
            } else {
                response.status(500).json(errors)
            }
        })
    })

    router.get('/chargerTransactions/:chargerID', function (request, response) {

        const chargerId = request.params.chargerID
        newDatabaseInterfaceTransactions.getTransactionsForCharger(chargerId, function (errors, chargerTransaction) {
            if (errors.length == 0 && chargerTransaction.length == 0) {
                response.status(404).end()
            } else if (errors.length == 0) {
                response.status(200).json(chargerTransaction)
            } else {
                response.status(500).json(errors)
            }
        })
    })

    router.post('/', function (request, response) {

        const { userID, chargerID, isKlarnaPayment, pricePerKwh } = request.body;
        newDatabaseInterfaceTransactions.addTransaction(userID, chargerID, isKlarnaPayment, pricePerKwh, function (errors, transaction) {
            if (errors.length > 0) {
                response.status(400).json(errors)
            } else if (transactionID) {
                response.status(201).json({
                    "transactionID": transactionID
                })
            } else {
                response.status(500).json(errors)
            }
        })
    })


    router.put('/payment/:transactionID', function (request, response) {

        const transactionId = request.params.transactionID
        const paymentId = request.body.paymentID
        newDatabaseInterfaceTransactions.updateTransactionPayment(transactionId, paymentId, function (error, updatedTransactionPayment) {
            if (error.length == 0) {
                response.status(201).json(updatedTransactionPayment)
            } else {
                if (error.includes("internalError") || error.includes("dbError")) {
                    response.status(500).json(error)
                } else {
                    response.status(404).json(error)
                }
            }
        })
    })

    router.put('/chargingStatus/:transactionID', function (request, response) {
        const transactionId = request.params.transactionID
        const kWhTransferred = request.body.kWhTransferred
        const currentChargePercentage = request.body.currentChargePercentage
        newDatabaseInterfaceTransactions.updateTransactionChargingStatus(transactionId, kWhTransferred, currentChargePercentage, function (error, updatedTransaction) {
            if (error.length == 0) {
                response.status(201).json(updatedTransaction)
            } else {
                if (error.includes("internalError") || error.includes("dbError")) {
                    response.status(500).json(error)
                } else {
                    response.status(404).json(error)
                }
            }
        })
    })

    router.put('/start/:transactionID', function (request, response) {

        const transactionID = request.params.transactionID
        const authorization_token = request.body.authorization_token;

        newDatabaseInterfaceTransactions.createKlarnaOrder(transactionID, authorization_token, function (error, klarnaOrder) {
            console.log(error);
            console.log(klarnaOrder);
            if (error.length === 0) {
                response.status(200).json(klarnaOrder)
            } else if (error.includes("internalError") || error.includes("dbError")) {
                response.status(500).json(error)
            } else {
                response.status(400).json(error);
            }
        })
    })

    router.post('/session', function (request, response) {
        const userID = request.body.userID
        const chargerID = request.body.chargerID

        newDatabaseInterfaceTransactions.getNewKlarnaPaymentSession(userID, chargerID, function (error, klarnaSessionTransaction) {
            if (error.length > 0) {
                response.status(400).json(error)
            } else if (klarnaSessionTransaction) {
                response.status(201).json(klarnaSessionTransaction)
            } else {
                response.status(500).json(error)
            }
        })
    })

    router.put('/stop/:transactionID', function (request, response) {
        const transactionID = request.params.transactionID
        newDatabaseInterfaceTransactions.finalizeKlarnaOrder(transactionID, function (error, stoppedTransaction) {
            if (error.length > 0) {
                response.status(400).json(error)
            } else if (stoppedTransaction) {
                response.status(200).json(stoppedTransaction)
            } else {
                response.status(500).json(error)
            }
        })
    })

    return router
}
