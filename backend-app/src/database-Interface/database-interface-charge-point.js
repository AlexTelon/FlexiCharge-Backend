module.exports = function({ dataAccessLayerChargePoint, dbErrorCheck, chargePointValidation }) {

    const exports = {}

    exports.getChargePoint = function(chargePointID, callback) {
        dataAccessLayerChargePoint.getChargePoint(chargePointID, function(error, chargePoint) {
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

    exports.addChargePoint = function(name, address, coordinates, klarnaReservationAmount, callback) {
        const validationError = chargePointValidation.chargePointValidation(name, address, coordinates)
        if (validationError.length > 0) {
            callback(validationError, [])
        } else {
            /*if ((klarnaReservationAmount == null) || (klarnaReservationAmount == undefined)) {
                klarnaReservationAmount = DEFAULT_RESERVATION_PRICE
            }*/
            dataAccessLayerChargePoint.addChargePoint(name, address, coordinates, function(error, chargePointID) {
                if (Object.keys(error).length > 0) {
                    dbErrorCheck.checkError(error, function(errorCode) {
                        callback(errorCode, [])
                    })
                } else {
                    callback([], chargePointID)
                }
            })
        }
    }

    exports.removeChargePoint = function(chargePointID, callback) {
        dataAccessLayerChargePoint.removeChargePoint(chargePointID, function(error, chargePointRemoved) { //chargePointRemoved = bool
            if (Object.keys(error).length > 0) {
                dbErrorCheck.checkError(error, function(errorCode) {
                    callback(errorCode, chargePointRemoved)
                })
            } else {
                callback([], chargePointRemoved)
            }
        })
    }

    exports.updateChargePoint = function(chargePointID, name, coordinates, address, callback) {
        const validationError = chargePointValidation.chargePointValidation(name, coordinates, address)
        if (validationError.length > 0) {
            callback(validationError, [])
        } else {
            dataAccessLayerChargePoint.updateChargePoint(chargePointID, name, coordinates, address, function(error, chargePoint) {
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