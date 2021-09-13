module.exports = function({ dataAccessLayerTransaction }) {

    const exports = {}

    exports.createTransaction = function(transaction, callback) {
        dataAccessLayerTransaction.createTransaction(transaction, callback)
    }

    return exports
}