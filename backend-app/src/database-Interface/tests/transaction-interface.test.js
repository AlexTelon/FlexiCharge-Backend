const assert = require("assert");
const SequelizeMock = require("sequelize-mock")

module.exports = function({ databaseInterfaceTransactions, transactionValidation,  }) {

    const exports = {}

    let DBConnectionMock = new SequelizeMock();
    
    var TransactionsMock = DBConnectionMock.define('Transactions', {
        "transactionID" : 1,
        "isKlarnaPayment" : true,
        "kwhTransfered" : 10,
        "currentChargePercentage" : null,
        "pricePerKwh" : null,
        "timestamp" : null,
        "paymentID" : "a03gm12-kd245dl-dsasd",
        "userID" : 1,
        "session_id" : "session_124kjkal",
        "client_token" : "client_token_1dg35ea",
        "paymentConfirmed" : true,
        "meterStart" : true
    })

    exports.getTransactionTest = function (transactionID, callback) {
        databaseInterfaceTransactions.getTransaction(transactionID, TransactionsMock, function(error, transaction) {
            console.log(`GetTransactionRun!`);
            console.log(transaction);
        });
    }

    exports.getTransactionsForUser = function (userID, callback) {
        dataAccessLayerTransaction.getTransactionsForUser(userID, function (error, userTransaction) {
            if (Object.keys(error).length > 0) {
                dbErrorCheck.checkError(error, function (errorCode) {
                    callback(errorCode, [])
                })
            } else {
                callback([], userTransaction)
            }
        })
    }

    exports.addTransactionTest = function (userID, chargerID, isKlarnaPayment, pricePerKwh, callback) {
        databaseInterfaceTransactions.addTransaction(userID, chargerID, isKlarnaPayment, pricePerKwh, callback)
        
        const validationError = transactionValidation.getAddTransactionValidation(pricePerKwh)
        if (validationError.length > 0) {
            callback(validationError, [])
        } else {
            timestamp = (Date.now() / 1000 | 0)
            dataAccessLayerTransaction.addTransaction(userID, chargerID, isKlarnaPayment, pricePerKwh, timestamp, TransactionsMock, function (error, transactionID) {
                if (Object.keys(error).length > 0) {
                    dbErrorCheck.checkError(error, function (errorCode) {
                        callback(errorCode, [])
                    })
                } else {
                    callback([], transactionID)
                }
            })
        }
    }

    exports.runTests = function() {
        const FailedTests = []
        

        // exports.addTransactionTest(1000001, 1000, true, 10,(error, transactionID) => {
        //     if (error.length > 0) {
        //         FailedTests.push(`addTransactionTest Failed! : ${error}`)
        //     }
        // })

        

        exports.getTransactionTest(1, (error, transaction) => {
            if (error.length > 0) {
                FailedTests.push(`getTransactionTest Failed! : ${error}`);
            }
        })

        if (FailedTests.length == 0) {
            console.log(`All Transaction Tests succeeded!`);
        } else {
            console.log(`Transaction tests had ${FailedTests.length} failed tests!`);
            FailedTests.forEach(message => {
                console.log(message);
            });
        }
    }

    return exports
}
