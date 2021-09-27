module.exports = function({ dataAccessLayerChargePoint, dbErrorCheck }) {

    const exports = {}

    exports.getChargePoint = function(chargePointId, callback) {
        dataAccessLayerChargePoint.getChargePoint(chargePointId, function(error, chargePoint) {
            if (Object.keys(error).length > 0) {
                dbErrorCheck.checkError(error, function(errorCode) {
                    callback(errorCode, [])
                })
            } else {
                if (chargePoint == null) {
                    callback([], [])
                } else {
                    callback([], chargePoint)
                }

            }
        })
    }

    exports.getChargePoints = function(callback) {
        dataAccessLayerChargePoint.getChargePoints(function(error, chargePoints) {
            if (Object.keys(error).length > 0) {
                dbErrorCheck.checkError(error, function(errorCode) {
                    callback(errorCode, [])
                })
            } else {
                callback([], chargePoints)
            }
        })
    }

    exports.addChargePoint = function(chargePointId, name, address, location, price, callback) {
        dataAccessLayerChargePoint.addChargePoint(chargePointId, name, address, location, price, function(error, chargePointId) {
            if (Object.keys(error).length > 0) {
                dbErrorCheck.checkError(error, function(errorCode) {
                    console.log(errorCode)
                    callback(errorCode, [])
                })
            } else {
                callback([], chargePointId)
            }
        })
    }

    exports.removeChargePoint = function(chargePointId, callback) {
        dataAccessLayerChargePoint.removeChargePoint(chargePointId, function(error, chargePointRemoved) { //chargePointRemoved = bool
            if (Object.keys(error).length > 0) {
                dbErrorCheck.checkError(error, function(errorCode) {
                    callback(errorCode, chargePointRemoved)
                })
            } else {
                callback([], chargePointRemoved)
            }
        })
    }

    exports.updateChargePoint = function(chargePointId, name, address, location, price, callback) {
        dataAccessLayerChargePoint.updateChargeStatus(chargePointId, name, address, location, price, function(error, chargePoint) {
            if (Object.keys(error).length > 0) {
                dbErrorCheck.checkError(error, function(errorCode) {
                    callback(errorCode, [])
                })
            } else {
                callback([], chargePoint)
            }
        })
    }


    return exports

}