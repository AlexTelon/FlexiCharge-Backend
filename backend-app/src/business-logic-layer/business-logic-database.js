module.exports = function({ dataAccessLayerDatabase }) {

    const exports = {}

    exports.connect = function(callback) {
        dataAccessLayerDatabase.connect(callback)
    }

    return exports
}