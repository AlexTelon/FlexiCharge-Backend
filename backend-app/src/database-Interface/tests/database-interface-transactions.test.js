const SequelizeMock = require('sequelize-mock')

module.exports = function({newDatabaseInterfaceTransactions}) {
    const exports = {}

    const DBConnectionMock = new SequelizeMock();
    let Transactions = DBConnectionMock.define('newTransactions', {
        transactionID: 1,
        userID: 1,
        paymentMethod: "Klarna",
        isPayed: null,
        payNow: null,
        transactionDate: null,
        paymentDueDate: null,
        payedDate: null,
        totalPrice: null
    })

    exports.addTransactionTest = function(chargeSessionID, userID, payNow, paymentDueDate, callback) {
        newDatabaseInterfaceTransactions.addTransaction(oldDate, newDate,  Transactions, (error, electricityTariff) => {
            const errorList = []

            error.forEach(err => {
                errorList.push(err)
            });

            callback(errorList)
        })   
    }

    exports.addTransactionTest = function(chargeSessionID, userID, payNow, paymentDueDate, callback) {
        newDatabaseInterfaceTransactions.addTransaction(oldDate, newDate, Transactions, (error, electricityTariff) => {
            const errorList = []

            error.forEach(err => {
                errorList.push(err)
            });

            callback(errorList)
        })
    }

    exports.getTransactionTest = function(chargeSessionID, userID, payNow, paymentDueDate, callback) {
        newDatabaseInterfaceTransactions.getTransaction(oldDate, newDate, Transactions, (error, electricityTariff) => {
            const errorList = []

            error.forEach(err => {
                errorList.push(err)
            });

            callback(errorList)
        })   
    }

    exports.getTransactionsForUserTest = function(chargeSessionID, userID, payNow, paymentDueDate, callback) {
        newDatabaseInterfaceTransactions.getTransactionsForUser(oldDate, newDate, Transactions, (error, electricityTariff) => {
            const errorList = []

            error.forEach(err => {
                errorList.push(err)
            });

            callback(errorList)
        })   
    }

    exports.updatePaymentMethodTest = function(chargeSessionID, userID, payNow, paymentDueDate, callback) {
        newDatabaseInterfaceTransactions.updatePaymentMethod(oldDate, newDate, Transactions, (error, electricityTariff) => {
            const errorList = []

            error.forEach(err => {
                errorList.push(err)
            });

            callback(errorList)
        })   
    }


    exports.runTests = function(){
        const FailedTests = []
        let amountOfTestsDone = 0
        let totalTests = Object.keys(exports).length - 1

        const checkIfAllTestsAreDone = function() {
            amountOfTestsDone++

            if (amountOfTestsDone >= totalTests) {
                if (FailedTests.length == 0) {
                    console.log(`All Transaction Tests succeeded!`);
                } else {
                    console.log(`Transaction Tests had ${FailedTests.length} failed tests!`);
                    FailedTests.forEach(message => {
                        console.log(message);
                    });
                }
            }
        }

    }

    return exports
}