module.exports = function({ newDataAccessLayerChargePoints, dbErrorCheck, chargePointValidation }) {

    const exports = {}

    exports.getChargePoint = function(chargePointID, database, callback) {
        newDataAccessLayerChargePoints.getChargePoint(chargePointID, database, function(error, chargePoint) {
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

    exports.addChargePoint = function(name, address, coordinates, database, callback) {
        // TODO validateParameters
        // const validationError = chargePointValidation.chargePointValidation(name, address, coordinates, klarnaReservationAmount)

        newDataAccessLayerChargePoints.addChargePoint(name, address, coordinates, database, function(error, chargePointID) {
            if (Object.keys(error).length > 0) {
                dbErrorCheck.checkError(error, function(errorCode) {
                    callback(errorCode, [])
                })
            } else {
                callback([], chargePointID)
            }
        })
    }

    exports.removeChargePoint = function(chargePointID, database, callback) {
        newDataAccessLayerChargePoints.removeChargePoint(chargePointID, database, function(error, chargePointRemoved) { //chargePointRemoved = bool
            if (Object.keys(error).length > 0) {
                dbErrorCheck.checkError(error, function(errorCode) {
                    callback(errorCode, chargePointRemoved)
                })
            } else {
                callback([], chargePointRemoved)
            }
        })
    }

    exports.updateChargePoint = function(chargePointID, name, address, coordinates , database, callback) {
        // TODO create new validation...
        // const validationError = chargePointValidation.chargePointValidation(name, address, coordinates, price)

        // if (validationError.length > 0) {
        //     callback(validationError, [])
        // } else {
            
        // }

        newDataAccessLayerChargePoints.updateChargePoint(chargePointID, name, address, coordinates, database, function(error, updatedChargePoint) {
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