module.exports = function({ databaseInit }) {

    const exports = {}

    exports.addTransaction = function(chargeSessionID, userID, payNow, paymentDueDate, paymentMethod, totalPrice, callback) {
        const date = (Date.now() / 1000 | 0)
        const transaction = {
            userID: userID,
            chargeSessionID: chargeSessionID,
            payNow : payNow,
            paymentMethod: paymentMethod,
            paymentDueDate : paymentDueDate,
            totalPrice : totalPrice,
            transactionDate : date
        }

        databaseInit.newTransactions.create(transaction)
            .then(transaction => callback([], transaction.transactionID))
            .catch(e => {
                console.log(e)
                callback(e, [])
            })
    }

    exports.getTransaction = function(transactionID, callback) {
        databaseInit.newTransactions.findOne({ where: { transactionID: transactionID }, raw: true })
            .then(transaction => callback([], transaction))
            .catch(e => {
                console.log(e)
                callback(e, [])
            })
    }

    exports.getTransactionsForUser = function(userID, callback) {
        databaseInit.newTransactions.findAll({ where: { userID: userID }, raw: true })
            .then(userTransactions => callback([], userTransactions))
            .catch(e => {
                console.log(e)
                callback(e, [])
            })
    }

    exports.updatePaymentMethod = function(transactionID, paymentMethod, callback) {
        databaseInit.newTransactions.update({
            paymentMethod: paymentMethod
        }, {
            where: {transactionID : transactionID},
            returning: true,
            raw: true
        }).then(transaction => {
            callback([], transaction)
        }).catch(e => {
            console.log(e);
            callback(e, [])
        })
    }

    exports.updateIsPayed = function(transactionID, isPayed, callback) {
        databaseInit.newTransactions.update({
            isPayed: isPayed
        }, {
            where: {transactionID : transactionID},
            returning: true,
            raw: true
        }).then(transaction => {
            callback([], transaction)
        }).catch(e => {
            console.log(e);
            callback(e, [])
        })
    }


    exports.updatePayedDate = function(transactionID, payedDate, callback) {
        databaseInit.newTransactions.update({
            payedDate: payedDate
        }, {
            where: {transactionID : transactionID},
            returning: true,
            raw: true
        }).then(transaction => {
            callback([], transaction)
        }).catch(e => {
            console.log(e);
            callback(e, [])
        })
    }

    exports.updateTotalPrice = function(transactionID, totalPrice, callback) {
        databaseInit.newTransactions.update({
            totalPrice: totalPrice
        }, {
            where: {transactionID : transactionID},
            returning: true,
            raw: true
        }).then(transaction => {
            callback([], transaction)
        }).catch(e => {
            console.log(e);
            callback(e, [])
        })
    }

    exports.getTransactionForChargeSession = function(chargeSessionID, database, callback){
        if(database == null){
            database = databaseInit.newTransactions
        }

        database.findOne({
            where: {
                chargeSessionID: chargeSessionID
            }
        }).then(function(transaction){
            callback([], transaction)
        }).catch(e => {
            console.log(e)
            callback(e, [])
        })
    }

    // exports.getTransactionsForCharger = function(chargerID, callback) {
    //     databaseInit.newTransactions.findAll({ where: { chargerID: chargerID }, raw: true })
    //         .then(chargerTransaction => callback([], chargerTransaction))
    //         .catch(e => {
    //             console.log(e)
    //             callback(e, [])
    //         })
    // }

    // exports.addKlarnaTransaction = function(userID, chargerID, pricePerKwh, session_id, client_token, isKlarnaPayment, timestamp, paymentConfirmed, callback){
        
    //     const klarnaTransaction = {
    //         userID: userID,
    //         chargerID: chargerID,
    //         pricePerKwh: pricePerKwh,
    //         session_id: session_id,
    //         client_token: client_token,
    //         paymentConfirmed: paymentConfirmed,
    //         isKlarnaPayment: isKlarnaPayment,
    //         timestamp: timestamp
    //     }
    //     databaseInit.newTransactions.create(klarnaTransaction, {
    //             returning: true,
    //             raw: true
    //         })
    //         .then(klarnaTransaction => callback([], klarnaTransaction))
    //         .catch(e => {
    //             console.log(e)
    //             callback(e, [])
    //         })
    // }
    // exports.updateTransactionPayment = function(transactionID, paymentID, callback) {
    //     databaseInit.newTransactions.update({
    //             paymentID: paymentID
    //         }, {
    //             where: { transactionID: transactionID },
    //             returning: true,
    //             raw: true
    //         })
    //         .then(transaction => callback([], transaction[1]))
    //         .catch(e => {
    //             console.log(e)
    //             callback(e, [])
    //         })
    // }
    // exports.updateTransactionPaymentConfirmed = function(transactionID, isPaymentConfirmed, callback) {
    //     databaseInit.newTransactions.update({
    //             paymentConfirmed: isPaymentConfirmed
    //         }, {
    //             where: { transactionID: transactionID },
    //             returning: true,
    //             raw: true
    //         })
    //         .then(transaction => callback([], transaction[1]))
    //         .catch(e => {
    //             console.log(e)
    //             callback(e, [])
    //         })
    // }
    // exports.updateTransactionChargingStatus = function(transactionID, kwhTransfered, currentChargePercentage, callback) {
    //     databaseInit.newTransactions.update({
    //             kwhTransfered: kwhTransfered,
    //             currentChargePercentage: currentChargePercentage
    //         }, {
    //             where: { transactionID: transactionID },
    //             returning: true,
    //             raw: true
    //         })
    //         .then(transaction => callback([], transaction[1]))
    //         .catch(e => {
    //             console.log(e)
    //             callback(e, [])
    //         })
    // }
    // exports.updateTransactionMeterStart = function(transactionID, meterStart, callback) {
    //     databaseInit.newTransactions.update({
    //         meterStart: meterStart
    //     }, {
    //         where: { transactionID: transactionID },
    //         returning: true,
    //         raw: true
    //     })
    //     .then(transaction => callback([], transaction[1]))
    //     .catch(e => {
    //         console.log(e)
    //         callback(e, [])
    //     })
    // }

    return exports
}