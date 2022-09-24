module.exports = function({ databaseInit }) {

    const exports = {}

    exports.addTransaction = function(chargeSessionID, userID, payNow, paymentDueDate, callback) {

        const transaction = {
            userID: userID,
            chargeSessionID: chargeSessionID,
            payNow : payNow,
            paymentDueDate : paymentDueDate
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

    exports.updatePaymentMethod = function(transactionID, newPaymentMethod, callback) {
        // TODO Update Payment Method of TranasctionID to newPaymentMethod
    }

    exports.updateIsPayed = function(transactionID, callback) {
        // TODO updateIsPayed
    }

    // transactionDate & paymentDueDate must be created when we create transaction, and we do not need to update them.

    exports.updatePayedDate = function(transactionID, callback) {
        // TODO update payedDate
    }

    exports.updateTotalPrice = function(transactionID, callback) {
        // TODO update totalPrice
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