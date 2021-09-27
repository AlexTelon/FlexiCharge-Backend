module.exports = function({ dataAccessLayerChargerPoint, dbErrorCheck, chargerValidation }) {

    const exports = {}

    exports.getChargerPoint = function(chargerPointId, callback){
        dataAccessLayerChargerPoint.getChargerPoint(chargerPointId, function(error, chargerPoint) {
            if (Object.keys(error).length > 0) {
                dbErrorCheck.checkError(error, function(errorCode) {
                    callback(errorCode, [])
                })
            } else {
                if (chargerPoint == null) {
                    callback([], [])
                } else {
                    callback([], chargerPoint)
                }

            }
        })
    }

    exports.getChargerPoints = function(callback) {
        dataAccessLayerChargerPoint.getChargerPoints(function(error, chargerpoints) {
            if (Object.keys(error).length > 0) {
                dbErrorCheck.checkError(error, function(errorCode) {
                    callback(errorCode, [])
                })
            } else {
                callback([], chargerpoints)
            }
        })
    }

    exports.addChargerPoint = function(chargePointId, name, address, location, price, callback) {
        dataAccessLayerChargerPoint.addChargerPoint(chargePointId, name, address, location, price, function(error, chargerPointId) {
            if (Object.keys(error).length > 0) {
                dbErrorCheck.checkError(error, function(errorCode) {
                    console.log(errorCode)
                    callback(errorCode, [])
                })
            } else {
                callback([], chargerPointId)
            }
        })
    }
    
    exports.removeChargerPoint = function(chargerPointId, callback) {
        dataAccessLayerChargerPoint.removeChargerPoint(chargerPointId, function(error, chargerPointRemoved) { //chargerPointRemoved = bool
            if (Object.keys(error).length > 0) {
                dbErrorCheck.checkError(error, function(errorCode) {
                    callback(errorCode, chargerPointRemoved)
                })
            } else {
                callback([], chargerPointRemoved)
            }
        })
    }

    exports.updateChargerPoint = function(chargePointId, name, address, location, price, callback) {
        dataAccessLayerCharger.updateChargerStatus(chargePointId, name, address, location, price, function(error, chargerPoint) {
            if (Object.keys(error).length > 0) {
                dbErrorCheck.checkError(error, function(errorCode) {
                    callback(errorCode, [])
                })
            } else {
                callback([], chargerPoint)
            }
        })
    }


    return exports

}