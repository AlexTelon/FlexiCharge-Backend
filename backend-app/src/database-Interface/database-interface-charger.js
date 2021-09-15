module.exports = function({ dataAccessLayerCharger }) {

    const exports = {}


    exports.getChargers = function(callback) {
        dataAccessLayerCharger.getChargers(function(errorCodes, chargers) {
            if (errorCodes.length > 0) {
                callback(errorCodes, null)
            } else {
                callback([], chargers)
            }
        })
    }

    exports.getCharger = function(chargerID, callback) {
        dataAccessLayerCharger.getCharger(chargerID, function(errorCodes, charger) {
            if (errorCodes.length > 0) {
                callback(errorCodes, null)
            } else {
                callback([], charger)
            }
        })
    }

    exports.getAvailableChargers = function(callback) {
        dataAccessLayerCharger.getAvailableChargers(function(errorCodes, chargers) {
            if (errorCodes.length > 0) {
                callback(errorCodes, null)
            } else {
                callback([], chargers)
            }
        })
    }

    //TODO: Change return value to be newly created chargerId
    exports.addCharger = function(chargerId, chargePointId, location, callback) {
        dataAccessLayerCharger.addCharger(chargerId, chargePointId, location, function(errorCodes, chargerAdded) { //ChargerAdded = bool
            if (errorCodes.length > 0) {
                callback(errorCodes, chargerAdded)
            } else {
                callback([], chargerAdded)
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

    //TODO: Change return value to be newly updated charger
    exports.updateChargerStatus = function(chargerId, status, callback) {
        dataAccessLayerCharger.updateChargerStatus(chargerId, status, function(errorCodes, chargerUpdated) { //chargerUpdated = bool
            if (errorCodes.length > 0) {
                callback(errorCodes, chargerUpdated)
            } else {
                callback([], chargerUpdated)
            }
        })
    }

    return exports
}