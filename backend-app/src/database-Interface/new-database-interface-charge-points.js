module.exports = function ({ newDataAccessLayerChargePoints, dbErrorCheck, newChargePointValidation }) {

    const exports = {}

    exports.getChargePoint = function (chargePointID, callback) {
        const validationErrors = newChargePointValidation.getChargePointValidation(chargePointID)
        if (validationErrors.length > 0) {
            callback(validationErrors, [])
        } else {
            newDataAccessLayerChargePoints.getChargePoint(chargePointID, function (error, chargePoint) {
                if (Object.keys(error).length > 0) {
                    dbErrorCheck.checkError(error, function (errorCode) {
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
    }

    exports.getChargePoints = function (callback) {
        newDataAccessLayerChargePoints.getChargePoints(function (error, chargePoints) {
            if (Object.keys(error).length > 0) {
                dbErrorCheck.checkError(error, function (errorCode) {
                    callback(errorCode, [])
                })
            } else {
                callback([], chargePoints)
            }
        })
    }

    exports.addChargePoint = function (name, address, coordinates, callback) {
        const validationErrors = newChargePointValidation.getAddChargePointValidation(name, address, coordinates)
        if (validationErrors.length > 0) {
            callback(validationErrors, [])
        } else {
            newDataAccessLayerChargePoints.addChargePoint(name, address, coordinates, function (error, chargePointID) {
                if (Object.keys(error).length > 0) {
                    dbErrorCheck.checkError(error, function (errorCode) {
                        callback(errorCode, [])
                    })
                } else {
                    callback([], chargePointID)
                }
            })
        }
    }

    exports.removeChargePoint = function (chargePointID, callback) {
        const validationErrors = newChargePointValidation.getRemoveChargePointValidation(chargePointID)
        if (validationErrors.length > 0) {
            callback(validationErrors, [])
        } else {
            newDataAccessLayerChargePoints.removeChargePoint(chargePointID, function (error, chargePointWasRemoved) {
                if (Object.keys(error).length > 0) {
                    dbErrorCheck.checkError(error, function (errorCode) {
                        callback(errorCode, chargePointWasRemoved)
                    })
                } else {
                    callback([], chargePointWasRemoved)
                }
            })
        }
    }

    exports.updateChargePoint = function (chargePointID, name, address, coordinates, callback) {
        const validationErrors = newChargePointValidation.getAddChargePointValidation(name, address, coordinates)
        if (validationErrors.length > 0) {
            callback(validationErrors, [])
        } else {
            newDataAccessLayerChargePoints.updateChargePoint(chargePointID, name, address, coordinates, function (error, updatedChargePoint) {
                if (Object.keys(error).length > 0) {
                    dbErrorCheck.checkError(error, function (errorCode) {
                        callback(errorCode, [])
                    })
                } else {
                    callback([], updatedChargePoint)
                }
            })
        }
    }

    return exports
}