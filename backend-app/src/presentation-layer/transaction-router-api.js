var express = require("express");

module.exports = function ({ databaseInterfaceTransactions, databaseInterfaceChargeSessions, databaseInterfaceKlarnaPayments, verifyUser, dataAccessLayerKlarna }) {

    function getMockTransaction(ongoing, userID) {
        return ongoing ? {
            "startTimstamp": Math.floor(Date.now() / 1000) - Math.floor(Math.random() * 3600), // UNIX timestamp (seconds) from (randomly) up to 1 hour ago
            "kwhTransferred": Math.floor(Math.random() * 100) + 1, // Random number between 0 and 100
            "currentChargePercentage": Math.floor(Math.random() * 100) + 1, // Random number between 0 and 100
            "pricePerKWh": Math.floor(Math.random() * 100_00) + 1, // Random number between 0 and 10 000 (= 100,00 kr)
            "connectorID": 100_000,
            "userID": userID,
        } : {
            "price": Math.floor(Math.random() * 1_000_00) + 1, // Random number between 0 and 100 000 (= 1 000,00 kr)
            "startTimstamp": Math.floor(Date.now() / 1000) - 3600 - Math.floor(Math.random() * 3600), // UNIX timestamp (seconds) from (randomly) 1 hour up to 2 hours ago
            "endTimstamp": Math.floor(Date.now() / 1000) - Math.floor(Math.random() * 3600), // UNIX timestamp (seconds) from (randomly) up to 1 hour ago
            "kwhTransferred": Math.floor(Math.random() * 100) + 1, // Random number between 0 and 100
            "discount": 0,
            "connectorID": 100_000,
            "userID": userID,
        };
    }

    const router = express.Router();

    router.post("/", verifyUser, function (request, response) {

        const { connectorID, paymentType } = request.body;

        const data = {
            "klarnaClientToken": "",
            "klarnaSessionID": "",
            "transactionID": 0
        }

        const userID = request.user.sub;

        if (connectorID === 100_000) {
            const price = 500;

            dataAccessLayerKlarna.getNewKlarnaPaymentSession(price, async function (error, klarnaSessionTransaction) {
                if (error.length > 0) { response.status(400).json(error); return; }
                if (!klarnaSessionTransaction) { response.status(500).json(error); return; }

                data.klarnaClientToken = klarnaSessionTransaction.client_token;
                data.klarnaSessionID = klarnaSessionTransaction.session_id;
                data.transactionID = 9999;

                response.status(201).json(data);
            });
            return;
        }

        databaseInterfaceChargeSessions.startChargeSession(connectorID, userID, function (errors, chargeSession) {
            if (errors.length > 0) {
                response.status(400).json(errors)
            } else if (chargeSession) {

                const chargeSessionID = chargeSession.dataValues.chargeSessionID;

                // TODO: FIX Variables
                payNow = false;
                paymentDueDate = Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 14; // Today + 2 weeks (this is NOT a proper way of doing this!)
                totalPrice = 0;
                databaseInterfaceTransactions.addTransaction(chargeSessionID, userID, connectorID, payNow, paymentDueDate, paymentType, totalPrice, function (errors, transaction) {
                    const transactionID = transaction.transactionID;
                    if (errors.length > 0) {
                        response.status(400).json(errors)
                    } else if (transactionID) {
                        response.status(201).json({
                            "transactionID": transactionID
                            // TODO: Send klarna things.
                        })
                    } else {
                        response.status(500).json(errors)
                    }
                })
            } else {
                response.status(500).json(errors)
            }
        })
    });

    router.put("/start/:transactionID", verifyUser, function (request, response) {
        const transactionID = request.params.transactionID;
        const authorization_token = request.body.authorization_token;

        if (transactionID == 9999) {
            const data = getMockTransaction(true, request.user.sub);
            response.status(200).json(data);
            return;
        }

        databaseInterfaceTransactions.startTransaction(transactionID, function (error, transaction) {
            console.log(error, transaction);
            if (error.length > 0) {
                if (error.includes("internalError") || error.includes("dbError")) {
                    response.status(500).json(error);
                    return;
                }
                response.status(400).json(error);
                return;
            }

            response.status(200).json({
                startTimstamp: transaction['ChargeSession.startTimstamp'],
                kwhTransfered: transaction['ChargeSession.kwhTransfered'],
                currentChargePercentage: transaction['ChargeSession.currentChargePercentage'],
                pricePerKwh: 999,
                connectorID: transaction['ChargeSession.connectorID'],
                userID: transaction.userID
            });
        });
    });

    router.get("/:transactionID", verifyUser, function (request, response) {
        const transactionID = request.params.transactionID;

        if (transactionID == 9999) {
            // 1/10 that charging is comleted
            const data = getMockTransaction(false, request.user.sub);
            response.status(200).json(data);
            return;
        }

        databaseInterfaceTransactions.getTransaction(transactionID, function (errors, transaction) {
            if (errors.length > 0) { response.status(500).json(errors); return; }
            if (transaction.length === 0) { response.status(404).end(); return; }

            response.status(200).json(transaction);
        });
    });

    router.put("/stop/:transactionID", verifyUser, function (request, response) {
        const transactionID = request.params.transactionID;

        if (transactionID == 9999) {
            const data = getMockTransaction(false, request.user.sub);
            response.status(200).json(data);
            return;
        }

        databaseInterfaceTransactions.stopTransaction(transactionID, function (error, stoppedTransaction) {
            console.log(error, stoppedTransaction);
            if (error.length > 0) {
                if (error.includes("internalError") || error.includes("dbError")) {
                    response.status(500).json(error);
                    return;
                }
                response.status(400).json(error);
                return;
            }
            response.status(200).json({
                price: stoppedTransaction.totalPrice,
                startTimstamp: stoppedTransaction['ChargeSession.startTimstamp'],
                endTimstamp: stoppedTransaction['ChargeSession.endTimstamp'],
                kwhTransferred: stoppedTransaction['ChargeSession.kWhTransferred'],
                discount: stoppedTransaction.discount,
                connectorID: stoppedTransaction['ChargeSession.connectorID'],
                userID: stoppedTransaction.userID
            });
        });
    });

    router.get("/userTransactions/:userID", verifyUser, function (request, response) {
        const userID = request.params.userID;

        databaseInterfaceTransactions.getTransactionsForUser(userID, function (errors, userTransaction) {
            if (errors.length > 0) { response.status(500).json(errors); return; }
            if (userTransaction.length === 0) { response.status(404).end(); return; }

            response.status(200).json(userTransaction);
        });
    });

    router.get("/chargerTransactions/:connectorID", verifyUser, function (request, response) {
        const connectorID = request.params.connectorID;

        databaseInterfaceTransactions.getTransactionsForCharger(connectorID, function (errors, chargerTransaction) {
            if (errors.length > 0) { response.status(500).json(errors); return; }
            if (chargerTransaction.length === 0) { response.status(404).end(); return; }

            response.status(200).json(chargerTransaction);
        });
    });

    return router;
};
