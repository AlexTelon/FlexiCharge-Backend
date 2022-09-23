const SequelizeMock = require("sequelize-mock")

module.exports = function({ dataAccessLayerTransaction, transactionValidation }) {

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

    exports.addTransactionTest = function (userID, chargerID, isKlarnaPayment, pricePerKwh, callback) {
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

    exports.getTransactionTest = function (transactionID, callback) {
        dataAccessLayerTransaction.getTransaction(transactionID, TransactionsMock, function (error, transaction) {            
            if (Object.keys(error).length > 0) {
                dbErrorCheck.checkError(error, function (errorCode) {
                    callback(errorCode, [])
                })
            } else {
                if (transaction == null) {
                    callback([], [])
                } else {
                    callback([], transaction)
                }
            }
        })
    }

    exports.runTests = function() {
        const FailedTests = []

        exports.addTransactionTest(4, 10011, true, 10,(error, transactionID) => {
            if (error.length > 0) {
                FailedTests.push(`addTransactionTest Failed! : ${error}`)
            }
        })

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
