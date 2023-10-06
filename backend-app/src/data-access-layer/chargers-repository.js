module.exports = function ({ databaseInit }) {

    const exports = {}

    exports.getChargers = function (callback) {
        databaseInit.Chargers.findAll({ raw: true })
            .then(chargers => callback([], chargers))
            .catch(e => {
                console.log(e)
                callback(e, [])
            })
    }

    exports.getCharger = function (connectorID, callback) {
        databaseInit.Chargers.findOne({ where: { connectorID: connectorID }, raw: true })
            .then(charger => callback([], charger))
            .catch(e => {
                console.log(e)
                callback(e, [])
            })
    }

    exports.getChargerBySerialNumber = function (serialNumber, callback) {
        databaseInit.Chargers.findOne({ where: { serialNumber: serialNumber }, raw: true })
            .then(charger => callback([], charger))
            .catch(e => {
                console.log(e)
                callback(e, [])
            })
    }

    exports.getAvailableChargers = function (callback) {
        databaseInit.Chargers.findAll({ where: { status: 'Available' }, raw: true })
            .then(chargers => callback([], chargers))
            .catch(e => {
                console.log(e)
                callback(e, [])
            })
    }

    exports.addCharger = function (chargePointID, serialNumber, coordinates, callback) {
        const charger = {
            chargePointID: chargePointID,
            serialNumber: serialNumber,
            coordinates: coordinates,
            status: 'Reserved'
        }

        databaseInit.Chargers.max("connectorID")
            .then(function (biggestconnectorID) {
                if (biggestconnectorID != undefined && biggestconnectorID != null && biggestconnectorID != NaN && biggestconnectorID >= 100000) {
                    charger.connectorID = biggestconnectorID + 1;
                } else {
                    charger.connectorID = 100000;
                }

                databaseInit.Chargers.create(charger)
                    .then(createdCharger => callback([], createdCharger))
                    .catch(e => {
                        if (!e.errors === undefined) {
                            if (e.errors[0].message == "connectorID must be unique") {
                                charger.connectorID = parseInt(e.errors[0].value) + 1;
                                databaseInit.Chargers.create(charger)
                                    .then(createdCharger => callback([], createdCharger))
                                    .catch(e => {
                                        console.log(e)
                                        callback(["dbError"], [])
                                    });
                            } else {
                                console.log(e)
                                callback(e, [])
                            }
                        } else {
                            console.log(e)
                            callback(e, [])
                        }
                    })
            })
            .catch(e => {
                console.log(e)
                callback(e, [])
            })
    }

    exports.removeCharger = function (connectorID, callback) {
        databaseInit.Chargers.destroy({
            where: { connectorID: connectorID },
            raw: true
        })
            .then(numberDeletedOfChargers => {

                if (deletedChargersAmount == 0) {
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

    exports.updateChargerStatus = function (connectorID, status, callback) {
        databaseInit.Chargers.update({
            status: status
        }, {
            where: { connectorID: connectorID },
            returning: true,
            raw: true
        })
            .then(charger => {
                if (charger[1][0] === undefined || charger == null) {
                    callback([], false)
                } else {
                    callback([], charger[1][0])
                }
            })
            .catch(e => {
                console.log(e)
                callback(e, [])
            })
    }

    return exports
}
