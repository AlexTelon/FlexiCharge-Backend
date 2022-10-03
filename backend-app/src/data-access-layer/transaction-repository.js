const { Client } = require('pg')

module.exports = function({ databaseInit, constants }) {

    const c = constants.get()
    const exports = {}

    exports.getTransaction = function(transactionID, callback) {
        databaseInit.Transactions.findOne({ where: { transactionID: transactionID }, raw: true })
            .then(transaction => callback([], transaction))
            .catch(e => {
                console.log(e)
                callback(e, [])
            })
    }

    exports.getTransactionsForUser = function(userID, callback) {
        databaseInit.Transactions.findAll({ where: { userID: userID }, raw: true })
            .then(userTransaction => callback([], userTransaction))
            .catch(e => {
                console.log(e)
                callback(e, [])
            })
    }

    exports.getActiveTransactionsForUser = function(userID, callback) {
        databaseInit.Transactions.findAll({
            where: { 
                userID: userID 
            }, 
            raw: true,
            include: [{
                model: databaseInit.Chargers,
                where: {
                    status: c.CHARGING
                },
                attributes: []
            }],
        })
        .then(userTransactions => callback([], userTransactions))
        .catch(e => {
            console.log(e)
            callback(e, [])
        })
    }

    exports.getTransactionsForCharger = function(chargerID, callback) {
        databaseInit.Transactions.findAll({ where: { chargerID: chargerID }, raw: true })
            .then(chargerTransaction => callback([], chargerTransaction))
            .catch(e => {
                console.log(e)
                callback(e, [])
            })
    }
    exports.addTransaction = function(userID, chargerID, isKlarnaPayment, pricePerKwh, timestamp, callback) {

        const transaction = {
            userID: userID,
            chargerID: chargerID,
            isKlarnaPayment: isKlarnaPayment,
            pricePerKwh: pricePerKwh,
            timestamp: timestamp
        }

        databaseInit.Transactions.create(transaction)
            .then(transaction => callback([], transaction.transactionID))
            .catch(e => {
                console.log(e)
                callback(e, [])
            })
    }

    exports.addKlarnaTransaction = function(userID, chargerID, pricePerKwh, session_id, client_token, isKlarnaPayment, timestamp, paymentConfirmed, callback){
        
        const klarnaTransaction = {
            userID: userID,
            chargerID: chargerID,
            pricePerKwh: pricePerKwh,
            session_id: session_id,
            client_token: client_token,
            paymentConfirmed: paymentConfirmed,
            isKlarnaPayment: isKlarnaPayment,
            timestamp: timestamp
        }
        databaseInit.Transactions.create(klarnaTransaction, {
                returning: true,
                raw: true
            })
            .then(klarnaTransaction => callback([], klarnaTransaction))
            .catch(e => {
                console.log(e)
                callback(e, [])
            })
    }
    exports.updateTransactionPayment = function(transactionID, paymentID, callback) {
        databaseInit.Transactions.update({
                paymentID: paymentID
            }, {
                where: { transactionID: transactionID },
                returning: true,
                raw: true
            })
            .then(transaction => callback([], transaction[1]))
            .catch(e => {
                console.log(e)
                callback(e, [])
            })
    }
    exports.updateTransactionPaymentConfirmed = function(transactionID, isPaymentConfirmed, callback) {
        databaseInit.Transactions.update({
                paymentConfirmed: isPaymentConfirmed
            }, {
                where: { transactionID: transactionID },
                returning: true,
                raw: true
            })
            .then(transaction => callback([], transaction[1]))
            .catch(e => {
                console.log(e)
                callback(e, [])
            })
    }
    exports.updateTransactionChargingStatus = function(transactionID, kwhTransfered, currentChargePercentage, callback) {
        databaseInit.Transactions.update({
                kwhTransfered: kwhTransfered,
                currentChargePercentage: currentChargePercentage
            }, {
                where: { transactionID: transactionID },
                returning: true,
                raw: true
            })
            .then(transaction => callback([], transaction[1]))
            .catch(e => {
                console.log(e)
                callback(e, [])
            })
    }
    exports.updateTransactionMeterStart = function(transactionID, meterStart, callback) {
        databaseInit.Transactions.update({
            meterStart: meterStart 
        }, {
            where: { transactionID: transactionID },
            returning: true,
            raw: true
        })
        .then(transaction => callback([], transaction[1]))
        .catch(e => {
            console.log(e)
            callback(e, [])
        })
    }

    return exports
}