module.exports = function({ databaseInit }) {

    const exports = {}

    exports.getKlarnaPaymentByTransactionID = function(database, transactionID) {
        if (database == null) {
            database = databaseInit.klarnaPayments
        }

        database.findOne({
            where: {
                transactionID : transactionID
            },
            raw: true,
        }).then(klarnaPayment => callback([], klarnaPayment))
        .catch(e => {
            console.log(e)
            callback(e, [])
        })
    }

    exports.addKlarnaPayment = function(client_token, session_id, transactionID, database, callback) {
        if (database == null) {
            database = databaseInit.klarnaPayments
        }

        const klarnaPayment = {
            client_token: client_token,
            session_id: session_id,
            transactionID: transactionID
        }

        database.create(klarnaPayment)
            .then(klarnaPayment => callback([], klarnaPayment))
            .catch(e => {
                console.log(e)
                callback(e, [])
            })
    }

    exports.updateOrderID = function(transactionID, order_id, database, callback) {
        if (database == null) {
            database = databaseInit.klarnaPayments
        }

        const klarnaPayment = {
            order_id: order_id
        }

        database.update(klarnaPayment, {
            where: {transactionID : transactionID},
            raw: true,
            returning : true
        }).then(klarnaPayment => callback([], klarnaPayment))
          .catch(e => {
                console.log(e)
                callback(e, [])
           })
    }

    return exports
}