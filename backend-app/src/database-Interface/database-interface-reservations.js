module.exports = function({ dataAccessLayerReservation }) {

    const exports = {}

    exports.createReservations = function(reservation, callback) {
        dataAccessLayerReservation.createReservations(reservation, callback)
    }

    return exports
}