const { Client } = require('pg')

module.exports = function({ databaseInit }) {

    const exports = {}

    exports.getTransaction = function(transactionID, callback){
        databaseInit.Transactions.findOne({ where: {transactionID: transactionID }, raw: true})
            .then(transaction => callback([], transaction))
            .catch(e => {
                console.log(e)
                callback(["internalError"], [])
            })
    }

    exports.getTransactionsForUser = function(userID, callback){
        databaseInit.Transactions.findAll({ where: { userID: userID}, raw: true})
            .then(userTransaction => callback([], userTransaction))
            .catch(e => {
                console.log(e)
                callback(["internalError"], [])
            })
    }

    exports.getTransactionsForCharger = function(chargerID, callback){
        databaseInit.Transactions.findAll({ where: { chargerID: chargerID}, raw: true})
            .then(chargerTransaction => callback([], chargerTransaction))
            .catch(e => {
                console.log(e)
                callback(["internalError"], [])
            })
    }
    exports.addTransaction = function(userID, chargerID, MeterStartValue){

        const transaction = {
            userID: userID,
            chargerID: chargerID,
            meterStop: MeterStartValue
        }

        databaseInit.Transactions.create(transaction)
            .then(a => callback([], true))
            .catch(e => {
                console.log(e)
                callback(["internalError"], false)
            })
    }
    exports.updateTransactionPayment = function(transactionID, paymentID){
        databaseInit.Transactions.update({
            paymentID: paymentID
        }, {
            where: { transactionID: transactionID },
            returning: true,
            raw: true
        })
        .then(a => callback([], true))
        .catch(e => {
            console.log(e)
            callback(['internalError'], false)
        })


    }
    exports.updateTransactionMeter = function(transactionID, meterValue, callback){
        databaseInit.Transactions.update({
            meterValue: meterValue
        }, {
            where: { transactionID: transactionID },
            returning: true,
            raw: true
        })
        .then(a => callback([], true))
        .catch(e => {
            console.log(e)
            callback(['internalError'], false)
        })

    }
    
    return exports
}