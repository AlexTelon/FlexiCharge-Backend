module.exports = function({ newDataAccessLayerChargePoints, dbErrorCheck, chargePointValidation }) {

    const exports = {}

    exports.getChargePoint = function(chargePointId, database, callback) {
        newDataAccessLayerChargePoints.getChargePoint(chargePointId, database, function(error, chargePoint) {
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

    exports.getChargePoints = function(database, callback) {
        newDataAccessLayerChargePoints.getChargePoints(database, function(error, chargePoints) {
            if (Object.keys(error).length > 0) {
                dbErrorCheck.checkError(error, function(errorCode) {
                    callback(errorCode, [])
                })
            } else {
                callback([], chargePoints)
            }
        })
    }

    exports.addChargePoint = function(name, location, coordinates, database, callback) {
        // TODO validateParameters
        // const validationError = chargePointValidation.chargePointValidation(name, location, coordinates, klarnaReservationAmount)

        newDataAccessLayerChargePoints.addChargePoint(name, location, coordinates, database, function(error, chargePointId) {
            if (Object.keys(error).length > 0) {
                dbErrorCheck.checkError(error, function(errorCode) {
                    callback(errorCode, [])
                })
            } else {
                callback([], chargePointId)
            }
        })
    }

    exports.removeChargePoint = function(chargePointId, database, callback) {
        newDataAccessLayerChargePoints.removeChargePoint(chargePointId, database, function(error, chargePointRemoved) { //chargePointRemoved = bool
            if (Object.keys(error).length > 0) {
                dbErrorCheck.checkError(error, function(errorCode) {
                    callback(errorCode, chargePointRemoved)
                })
            } else {
                callback([], chargePointRemoved)
            }
        })
    }

    exports.updateChargePoint = function(chargePointId, name, location, price, database, callback) {
        // TODO create new validation...
        // const validationError = chargePointValidation.chargePointValidation(name, location, coordinates, price)

        // if (validationError.length > 0) {
        //     callback(validationError, [])
        // } else {
            
        // }

        newDataAccessLayerChargePoints.updateChargePoint(chargePointId, name, location, price, database, function(error, updatedChargePoint) {
            if (Object.keys(error).length > 0) {
                dbErrorCheck.checkError(error, function(errorCode) {
                    callback(errorCode, [])
                })
            } else {
                callback([], updatedChargePoint)
            }
        })
    }
    
    return exports
}