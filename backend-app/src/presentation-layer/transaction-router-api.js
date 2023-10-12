var express = require("express");

module.exports = function ({ databaseInterfaceTransactions, databaseInterfaceChargeSessions, databaseInterfaceKlarnaPayments, verifyUser, dataAccessLayerKlarna }) {

    function getMockTransaction(ongoing, userID) {
        return ongoing ? {
            "startTimestamp": Math.floor(Date.now() / 1000) - Math.floor(Math.random() * 3600), // UNIX timestamp (seconds) from (randomly) up to 1 hour ago
            "kwhTransferred": Math.floor(Math.random() * 100) + 1, // Random number between 0 and 100
            "currentChargePercentage": Math.floor(Math.random() * 100) + 1, // Random number between 0 and 100
            "pricePerKWh": Math.floor(Math.random() * 100_00) + 1, // Random number between 0 and 10 000 (= 100,00 kr)
            "connectorID": 100_000,
            "userID": userID,
        } : {
            "price": Math.floor(Math.random() * 1_000_00) + 1, // Random number between 0 and 100 000 (= 1 000,00 kr)
            "startTimestamp": Math.floor(Date.now() / 1000) - 3600 - Math.floor(Math.random() * 3600), // UNIX timestamp (seconds) from (randomly) 1 hour up to 2 hours ago
            "endTimestamp": Math.floor(Date.now() / 1000) - Math.floor(Math.random() * 3600), // UNIX timestamp (seconds) from (randomly) up to 1 hour ago
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

        databaseInterfaceChargeSessions.createChargeSession(connectorID, userID, function (errors, chargeSession) {
            if (errors.length > 0) {
                response.status(400).json(errors)
            } else if (chargeSession) {

                const chargeSessionID = chargeSession.dataValues.chargeSessionID;

                databaseInterfaceTransactions.addTransaction(chargeSessionID, userID, connectorID, paymentType, function (errors, transaction) {
                    const transactionID = transaction.transactionID;
                    if (errors.length > 0) {
                        response.status(400).json(errors)
                    } else if (transactionID) {

                        data.transactionID = transactionID;

                        const price = 500;

                        dataAccessLayerKlarna.getNewKlarnaPaymentSession(price, async function (error, klarnaSessionTransaction) {
                            if (error.length > 0) { response.status(400).json(error); return; }
                            if (!klarnaSessionTransaction) { response.status(500).json(error); return; }

                            data.klarnaClientToken = klarnaSessionTransaction.client_token;
                            data.klarnaSessionID = klarnaSessionTransaction.session_id;

                            response.status(201).json(data);
                        });
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
        // TODO: Check authorization_token (from Klarna, to make sure that the user has paid)

        if (transactionID == 9999) {
            const data = getMockTransaction(true, request.user.sub);
            response.status(200).json(data);
            return;
        }

        databaseInterfaceTransactions.startTransaction(transactionID, function (error, transaction) {
            console.log('tra-sat_0', error, transaction);
            if (error.length > 0) {
                if (error.includes("internalError") || error.includes("dbError")) {
                    response.status(500).json(error);
                    return;
                }
                response.status(400).json(error);
                return;
            }

            const data = {
                startTimestamp: transaction['ChargeSession.startTime'] || null,
                kwhTransferred: transaction['ChargeSession.kWhTransferred'] || 0,
                currentChargePercentage: transaction['ChargeSession.currentChargePercentage'] || 0,
                pricePerKwh: 999 || null,
                connectorID: transaction['ChargeSession.connectorID'] || null,
                userID: transaction.userID || null
            }

            console.log('tra-sat_1', transaction, data)

            response.status(200).json(data);
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

            console.log('tra-rg', transaction);

            response.status(200).json(('ChargeSession.endTime' in transaction && transaction['ChargeSession.endTime'] > 0) ? {
                price: transaction.totalPrice || 0,
                startTimestamp: transaction['ChargeSession.startTime'] || null,
                endTimestamp: transaction['ChargeSession.endTime'] || null,
                kwhTransferred: transaction['ChargeSession.kWhTransferred'] || 0,
                discount: transaction.discount || 0,
                connectorID: transaction['ChargeSession.connectorID'] || null,
                userID: transaction.userID || null,
            } : {
                startTimestamp: transaction['ChargeSession.startTime'] || null,
                kwhTransferred: transaction['ChargeSession.kWhTransferred'] || 0,
                currentChargePercentage: transaction['ChargeSession.currentChargePercentage'] || 0,
                pricePerKwh: 999 || null,
                connectorID: transaction['ChargeSession.connectorID'] || null,
                userID: transaction.userID || null,
            });
        });
    });

    router.put("/stop/:transactionID", verifyUser, function (request, response) {
        const transactionID = request.params.transactionID;

        if (transactionID == 9999) {
            const data = getMockTransaction(false, request.user.sub);
            response.status(200).json(data);
            return;
        }

        databaseInterfaceTransactions.stopTransaction(transactionID, function (error, transaction) {
            console.log('tra-sot_0', error, transaction);
            if (error.length > 0) {
                if (error.includes("internalError") || error.includes("dbError")) {
                    response.status(500).json(error);
                    return;
                }
                response.status(400).json(error);
                return;
            }

            const data = {
                price: transaction.totalPrice || 0,
                startTimestamp: transaction['ChargeSession.startTime'] || null,
                endTimestamp: transaction['ChargeSession.endTime'] || null,
                kwhTransferred: transaction['ChargeSession.kWhTransferred'] || 0,
                discount: transaction.discount || 0,
                connectorID: transaction['ChargeSession.connectorID'] || null,
                userID: transaction.userID || null,
            }

            console.log('tra-sot_1', transaction, data)

            response.status(200).json(data);
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
