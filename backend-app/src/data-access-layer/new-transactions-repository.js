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

        databaseInit.newTransactions.create(transaction)
            .then(transaction => callback([], transaction))
            .catch(e => {
                console.log(e)
                callback(e, [])
            })
    }

    exports.getTransaction = function (transactionID, callback) {
        databaseInit.newTransactions.findOne({ where: { transactionID: transactionID }, raw: true })
            .then(transaction => callback([], transaction))
            .catch(e => {
                console.log(e)
                callback(e, [])
            })
    }

    exports.getTransactionsForUser = function (userID, callback) {
        databaseInit.newTransactions.findAll({ where: { userID: userID }, raw: true })
            .then(userTransactions => callback([], userTransactions))
            .catch(e => {
                console.log(e)
                callback(e, [])
            })
    }

    exports.getTransactionsForCharger = function(chargerID, callback) {
        databaseInit.newTransactions.findAll({ where: {chargerID : chargerID}, raw: true })
            .then(transactions => callback([], transactions))
            .catch(e => {
                console.log(e)
                callback(e, [])
            })
    }

    exports.updatePaymentMethod = function (transactionID, paymentMethod, callback) {
        databaseInit.newTransactions.update({
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

    exports.updateIsPayed = function (transactionID, isPayed, callback) {
        databaseInit.newTransactions.update({
            isPayed: isPayed
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


    exports.updatePayedDate = function (transactionID, payedDate, callback) {
        databaseInit.newTransactions.update({
            payedDate: payedDate
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
        databaseInit.newTransactions.update({
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
        databaseInit.newTransactions.findOne({
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