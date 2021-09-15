module.exports = function({ dataAccessLayerCharger }) {

    const exports = {}


    exports.getChargers = function(callback) {
        dataAccessLayerCharger.getChargers(function(errorCodes, chargers) {
            if (errorCodes.length > 0) {
                callback(errorCodes, [])
            } else {
                callback([], chargers)
            }
        })
    }

    exports.getCharger = function(chargerID, callback) {
        dataAccessLayerCharger.getCharger(chargerID, function(errorCodes, charger) {
            if (errorCodes.length > 0) {
                callback(errorCodes, [])
            } else {
                callback([], charger)
            }
        })
    }

    exports.getAvailableChargers = function(callback) {
        dataAccessLayerCharger.getAvailableChargers(function(errorCodes, chargers) {
            if (errorCodes.length > 0) {
                callback(errorCodes, [])
            } else {
                callback([], chargers)
            }
        })
    }


    exports.addCharger = function(chargePointId, location, callback) {
        dataAccessLayerCharger.addCharger(chargePointId, location, function(errorCodes, chargerId) {
            if (errorCodes.length > 0) {
                callback(errorCodes, [])
            } else {
                callback([], chargerId)
            }
        })
    }

    exports.removeCharger = function(chargerId, callback) {
        dataAccessLayerCharger.removeCharger(chargerId, function(errorCodes, chargerRemoved) { //chargerRemoved = bool
            if (errorCodes.length > 0) {
                callback(errorCodes, chargerRemoved)
            } else {
                callback([], chargerRemoved)
            }
        })
    }


    exports.updateChargerStatus = function(chargerId, status, callback) {
        dataAccessLayerCharger.updateChargerStatus(chargerId, status, function(errorCodes, charger) {
            if (errorCodes.length > 0) {
                callback(errorCodes, [])
            } else {
                callback([], charger)
            }
        })
    }

    return exports
}