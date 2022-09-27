module.exports = function({ databaseInit }) {

    const exports = {}

    exports.getChargePoint = function(chargePointId, database, callback) {
        if (database == null) {
            database = databaseInit.newChargePoints
        }

        database.findOne({ where: { chargePointID: chargePointId }, raw: true })
            .then(chargePoint => callback([], chargePoint))
            .catch(e => {
                console.log(e)
                callback(e, [])
            })
    }

    exports.getChargePoints = function(database, callback) {
        if (database == null) {
            database = databaseInit.newChargePoints
        }

        database.findAll({ raw: true })
            .then(chargePoints => callback([], chargePoints))
            .catch(e => {
                console.log(e)
                callback(e, [])
            })

    }

    exports.addChargePoint = function(name, location, coordinates, database, callback) {
        if (database == null) {
            database = databaseInit.newChargePoints
        }

        const chargePoint = {
            name: name,
            location: location,
            coordinates: coordinates
        }

        database.create(chargePoint)
            .then(chargePoint => callback([], chargePoint.chargePointID))
            .catch(e => {
                console.log(e)
                callback(e, [])
            })
    }

    exports.removeChargePoint = function(chargePointId, database, callback) {
        if (database == null) {
            database = databaseInit.newChargePoints
        }

        database.destroy({
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

    exports.updateChargePoint = function(chargePointId, name, location, price, database, callback) {
        if (database == null) {
            database = databaseInit.newChargePoints
        }

        let updateProperties = {}

        if (name != null) {
            updateProperties.name = name
        }

        if (location != null) {
            updateProperties.location = location
        }

        // if (coordinates != null) {
        //     updateProperties.coordinates = coordinates
        // }

        if (price != null) {
            updateProperties.price = price
        }
        
        database.update(updateProperties, {
                where: { chargePointID: chargePointId },
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