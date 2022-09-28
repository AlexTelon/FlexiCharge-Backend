module.exports = function({ databaseInit }) {

    const exports = {}

    exports.getChargePoint = function(chargePointID, database, callback) {
        if (database == null) {
            database = databaseInit.newChargePoints
        }

        database.findOne({ where: { chargePointID: chargePointID }, raw: true })
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

    exports.addChargePoint = function(name, address, coordinates, database, callback) {
        if (database == null) {
            database = databaseInit.newChargePoints
        }

        const chargePoint = {
            name: name,
            address: address,
            coordinates: coordinates
        }

        database.create(chargePoint)
            .then(chargePoint => callback([], chargePoint.chargePointID))
            .catch(e => {
                console.log(e)
                callback(e, [])
            })
    }

    exports.removeChargePoint = function(chargePointID, database, callback) {
        if (database == null) {
            database = databaseInit.newChargePoints
        }

        database.destroy({
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

    exports.updateChargePoint = function(chargePointID, name, address, coordinates, database, callback) {
        if (database == null) {
            database = databaseInit.newChargePoints
        }

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
       
        database.update(updateProperties, {
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