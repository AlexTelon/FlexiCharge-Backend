module.exports = function({ databaseInit }) {

    const exports = {}

    exports.getChargePoint = function(chargePointId, callback) {
        databaseInit.newChargePoints.findOne({ where: { chargePointID: chargePointId }, raw: true })
            .then(chargePoint => callback([], chargePoint))
            .catch(e => {
                console.log(e)
                callback(e, [])
            })
    }

    exports.getChargePoints = function(callback) {
        databaseInit.newChargePoints.findAll({ raw: true })
            .then(chargePoints => callback([], chargePoints))
            .catch(e => {
                console.log(e)
                callback(e, [])
            })

    }

    exports.addChargePoint = function(name, address, coordinates, callback) {
        const chargePoint = {
            name: name,
            location: address,
            coordinates: coordinates
        }

        databaseInit.newChargePoints.create(chargePoint)
            .then(chargePoint => callback([], chargePoint.chargePointID))
            .catch(e => {
                console.log(e)
                callback(e, [])
            })
    }

    exports.removeChargePoint = function(chargePointId, callback) {
        databaseInit.newChargePoints.destroy({
                where: { chargePointID: chargePointId },
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

    exports.updateChargePoint = function(chargePointId, name, address, coordinates, callback) {
        databaseInit.newChargePoints.update({
                name: name,
                address: address,
                coordinates: coordinates
            }, {
                where: { chargePointID: chargePointId },
                returning: true,
                raw: true
            })
            .then(chargePoint => callback([], chargePoint[1][0]))
            .catch(e => {
                console.log(e)
                callback(e, [])
            })

    }

    return exports
}