module.exports = function({ dataAccessLayerDatabase }) {

    const exports = {}

    exports.createCharger = function(charger,callback) {
        dataAccessLayerDatabase.createCharger(charger,callback)
    }

    exports.createTransaction = function(transaction,callback) {
        dataAccessLayerDatabase.createTransaction(transaction,callback)
    }

    exports.createReservations = function(reservation,callback) {
        dataAccessLayerDatabase.createReservations(reservation,callback)
    }

    return exports
}