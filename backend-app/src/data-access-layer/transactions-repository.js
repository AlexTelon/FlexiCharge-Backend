module.exports = function ({ databaseInit }) {

    const exports = {}

    exports.addTransaction = function (chargeSessionID, userID, payNow, paymentDueDate, paymentMethod, totalPrice, callback) {
        const date = (Date.now() / 1000 | 0)
        const transaction = {
            userID: userID,
            chargeSessionID: chargeSessionID,
            payNow: payNow,
            paymentMethod: paymentMethod,
            paymentDueDate: paymentDueDate,
            totalPrice: totalPrice,
            transactionDate: date
        }

        databaseInit.Transactions.create(transaction)
            .then(transaction => callback([], transaction))
            .catch(e => {
                console.log(e)
                callback(e, [])
            })
    }

    exports.getTransaction = function (transactionID, callback) {
        databaseInit.Transactions.findOne({ where: { transactionID: transactionID }, raw: true })
            .then(transaction => callback([], transaction))
            .catch(e => {
                console.log(e)
                callback(e, [])
            })
    }

    exports.getTransactionsForUser = function (userID, callback) {
        databaseInit.Transactions.findAll({ where: { userID: userID }, raw: true })
            .then(userTransactions => callback([], userTransactions))
            .catch(e => {
                console.log(e)
                callback(e, [])
            })
    }

    exports.getTransactionsForCharger = function(connectorID, callback) {
        databaseInit.Transactions.findAll({ where: {connectorID : connectorID}, raw: true })
            .then(transactions => callback([], transactions))
            .catch(e => {
                console.log(e)
                callback(e, [])
            })
    }

    exports.updatePaymentMethod = function (transactionID, paymentMethod, callback) {
        databaseInit.Transactions.update({
            paymentMethod: paymentMethod
        }, {
            where: { transactionID: transactionID },
            returning: true,
            raw: true
        }).then(transaction => {
            callback([], transaction)
        }).catch(e => {
            console.log(e);
            callback(e, [])
        })
    }

    exports.updateisPaid = function (transactionID, isPaid, callback) {
        databaseInit.Transactions.update({
            isPaid: isPaid
        }, {
            where: { transactionID: transactionID },
            returning: true,
            raw: true
        }).then(transaction => {
            callback([], transaction)
        }).catch(e => {
            console.log(e);
            callback(e, [])
        })
    }


    exports.updatepaidDate = function (transactionID, paidDate, callback) {
        databaseInit.Transactions.update({
            paidDate: paidDate
        }, {
            where: { transactionID: transactionID },
            returning: true,
            raw: true
        }).then(transaction => {
            callback([], transaction)
        }).catch(e => {
            console.log(e);
            callback(e, [])
        })
    }

    exports.updateTotalPrice = function (transactionID, totalPrice, callback) {
        databaseInit.Transactions.update({
            totalPrice: totalPrice
        }, {
            where: { transactionID: transactionID },
            returning: true,
            raw: true
        }).then(transaction => {
            callback([], transaction)
        }).catch(e => {
            console.log(e);
            callback(e, [])
        })
    }

    exports.getTransactionForChargeSession = function (chargeSessionID, callback) {
        databaseInit.Transactions.findOne({
            where: {
                chargeSessionID: chargeSessionID
            }
        }).then(function (transaction) {
            callback([], transaction)
        }).catch(e => {
            console.log(e)
            callback(e, [])
        })
    }

    return exports
}