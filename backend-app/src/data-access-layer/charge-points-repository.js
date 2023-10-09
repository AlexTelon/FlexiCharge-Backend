module.exports = function({ databaseInit }) {

    const exports = {}

    exports.getChargePoint = function(chargePointID, callback) {
        databaseInit.ChargePoints.findOne({ where: { chargePointID: chargePointID }, raw: true })
            .then(chargePoint => callback([], chargePoint))
            .catch(e => {
                console.log(e)
                callback(e, [])
            })
    }

    exports.getChargePoints = function(callback) {
        databaseInit.ChargePoints.findAll({ raw: true })
            .then(chargePoints => callback([], chargePoints))
            .catch(e => {
                console.log(e)
                callback(e, [])
            })

    }

    exports.addChargePoint = function(name, address, coordinates, callback) {
        const chargePoint = {
            name: name,
            address: address,
            coordinates: coordinates
        }

        databaseInit.ChargePoints.create(chargePoint)
            .then(chargePoint => callback([], chargePoint))
            .catch(e => {
                console.log(e)
                callback(e, [])
            })
    }

    exports.removeChargePoint = function(chargePointID, callback) {
        databaseInit.ChargePoints.destroy({
                where: { chargePointID: chargePointID },
                raw: true
            })
            .then(deletedChargePointsAmount => {
                if (deletedChargePointsAmount == 0) {
                    callback([], false)
                } else {
                    callback([], true)
                }

            })
            .catch(e => {
                console.log(e)
                callback(e, false)
            })

    }

    exports.updateChargePoint = function(chargePointID, name, address, coordinates, callback) {
        let updateProperties = {}

        if (name != null) {
            updateProperties.name = name
        }

        if (address != null) {
            updateProperties.address = address
        }

        if (coordinates != null) {
            updateProperties.coordinates = coordinates
        }

        databaseInit.ChargePoints.update(updateProperties, {
                where: { chargePointID: chargePointID },
                returning: true,
                raw: true
            })
            .then(chargePoint => callback([], chargePoint[1]))
            .catch(e => {
                console.log(e)
                callback(e, [])
            })

    }

    return exports
}
