module.exports = function({ dataAccessLayerChargePoint, dbErrorCheck, chargePointValidation }) {

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

    exports.addChargePoint = function(name, address, coordinates, callback) {
        // TODO validateParameters
        // const validationError = chargePointValidation.chargePointValidation(name, location, coordinates, klarnaReservationAmount)

        dataAccessLayerChargePoint.addChargePoint(name, address, coordinates, function(error, chargePointId) {
            if (Object.keys(error).length > 0) {
                dbErrorCheck.checkError(error, function(errorCode) {
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

    exports.updateChargePoint = function(chargePointId, name, address, coordinates, callback) {
        // TODO create new validation...
        const validationError = chargePointValidation.chargePointValidation(name, address, coordinates)
        if (validationError.length > 0) {
            callback(validationError, [])
        } else {
            dataAccessLayerChargePoint.updateChargePoint(chargePointId, name, address, coordinates, function(error, chargePoint) {
                if (Object.keys(error).length > 0) {
                    dbErrorCheck.checkError(error, function(errorCode) {
                        callback(errorCode, [])
                    })
                } else {
                    callback([], chargePoint)
                }
            })
        }
    }
    
    return exports
}