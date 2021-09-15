const { Client } = require('pg')

module.exports = function({ databaseInit }) {

    const exports = {}

    exports.createTransaction = function(transaction, callback) {

        databaseInit.Transactions.create(transaction)
            .then(transaction => callback([], transaction.transactionID))
            .catch(e => {
                if (e) {
                    console.log(e)
                    callback("Can not create transaction", null)
                } else {
                    console.log(e)
                    callback(e, null)
                }
            })

    }
    return exports
}