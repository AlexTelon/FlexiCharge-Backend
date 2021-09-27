module.exports = function({ databaseInit }) {

    const exports = {}


    exports.getChargePoint = function(chargePointId, callback) {
        databaseInit.ChargePoints.findOne({ where: { chargePointID: chargePointId }, raw: true })
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

    exports.addChargePoint = function(name, address, location, price, callback) {

        const chargePoint = {
            name: name,
            address: address,
            location: location,
            price: price
        }

        databaseInit.ChargePoints.create(chargePoint)
            .then(chargePoint => callback([], chargePoint.chargePointID))
            .catch(e => {
                console.log(e)
                callback(e, [])
            })

    }

    exports.removeChargePoint = function(chargePointId, callback) {
        databaseInit.ChargePoints.destroy({
                where: { chargePointID: chargePointId },
                raw: true
            })
            .then(numberDeletedOfChargePoints => {

                if (numberDeletedOfChargePoints == 0) {
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

    exports.updateChargePoint = function(chargePointId, name, address, location, price, callback) {
        databaseInit.ChargePoints.update({
                name: name,
                address: address,
                location: location,
                price: price
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