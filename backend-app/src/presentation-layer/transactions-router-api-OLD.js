var express = require("express");

module.exports = function ({ databaseInterfaceTransactions, dataAccessLayerKlarna }) {

    function getMockTransaction() {
        return {
            "transactionID": 9999,
            "isKlarnaPayment": true,
            "kwhTransfered": Math.floor(Math.random() * 100) + 1, // Random number between 0 and 100
            "currentChargePercentage": Math.floor(Math.random() * 101), // Random number between 0 and 100
            "pricePerKwh": (Math.random() * 100).toFixed(2), // Random number between 0 and 100 with 2 decimal places
            "timestamp": Date.now(),
            "paymentID": null,
            "userID": "1",
            "session_id": null,
            "klarna_consumer_token": null,
            "paymentConfirmed": true,
            "meterStart": 1,
            "chargerID": 100000
        };
    }

    const router = express.Router()

    router.post('/', function (request, response) {

        const { userID, chargerID, isKlarnaPayment, pricePerKwh } = request.body;
        const data = getMockTransaction();

        const price = 500;

        dataAccessLayerKlarna.getNewKlarnaPaymentSession(price, async function (error, klarnaSessionTransaction) {
            if (error.length > 0) { response.status(400).json(error); return; }
            if (!klarnaSessionTransaction) { response.status(500).json(error); return; }

            data.klarna_consumer_token = klarnaSessionTransaction.client_token;
            response.status(201).json(data);
        });
        return;
    });

    router.put('/start/:transactionID', function (request, response) {

        const transactionID = request.params.transactionID
        const authorization_token = request.body.authorization_token;

        const data = getMockTransaction();
        response.status(200).json(data);
        return;
    })

    router.get('/:transactionID', function (request, response) {

        const transactionID = request.params.transactionID;

        const data = getMockTransaction();
        response.status(200).json(data);
        return;
    })

    router.put('/stop/:transactionID', function (request, response) {
        const transactionID = request.params.transactionID

        const data = getMockTransaction();
        response.status(200).json(data);
        return;
    })

    return router
}
