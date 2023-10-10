module.exports = function ({ databaseInit }) {

    const exports = {}

    exports.getKlarnaPaymentByTransactionID = function (transactionID, callback) {
        databaseInit.KlarnaPayments.findOne({
            where: {
                transactionID: transactionID
            },
            raw: true,
        }).then(klarnaPayment => callback([], klarnaPayment))
            .catch(e => {
                console.log(e)
                callback(e, [])
            })
    }

    exports.addKlarnaPayment = function (client_token, session_id, transactionID, callback) {
        const klarnaPayment = {
            client_token: client_token,
            session_id: session_id,
            transactionID: transactionID
        }

        databaseInit.KlarnaPayments.create(klarnaPayment)
            .then(klarnaPayment => callback([], klarnaPayment))
            .catch(e => {
                console.log(e)
                callback(e, [])
            })
    }

    exports.updateOrderID = function (transactionID, order_id, callback) {
        const klarnaPayment = {
            order_id: order_id
        }

        databaseInit.KlarnaPayments.update(klarnaPayment, {
            where: { transactionID: transactionID },
            raw: true,
            returning: true
        }).then(klarnaPayment => callback([], klarnaPayment))
            .catch(e => {
                console.log(e)
                callback(e, [])
            })
    }

    return exports
}