module.exports = function({ dataAccessLayerCharger }) {

    const exports = {}

    exports.createCharger = function(charger, callback) {
        dataAccessLayerCharger.createCharger(charger, callback)
    }

    return exports
}