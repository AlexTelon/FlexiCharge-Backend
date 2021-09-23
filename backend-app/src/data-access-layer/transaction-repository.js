const { Client } = require('pg')

module.exports = function({ databaseInit }) {

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

    exports.getTransactionsForCharger = function(chargerID, callback) {
        databaseInit.Transactions.findAll({ where: { chargerID: chargerID }, raw: true })
            .then(chargerTransaction => callback([], chargerTransaction))
            .catch(e => {
                console.log(e)
                callback(e, [])
            })
    }
    exports.addTransaction = function(userID, chargerID, MeterStartValue, timestamp, callback) {

        const transaction = {
            userID: userID,
            chargerID: chargerID,
            meterStart: MeterStartValue,
            timestamp: timestamp
        }

        databaseInit.Transactions.create(transaction)
            .then(transaction => callback([], transaction.transactionID))
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
    exports.updateTransactionMeter = function(transactionID, meterValue, callback) {
        databaseInit.Transactions.update({
                meterStop: meterValue
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