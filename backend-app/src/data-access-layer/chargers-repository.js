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

    exports.getCharger = function (chargerID, callback) {
        databaseInit.Chargers.findOne({ where: { chargerID: chargerID }, raw: true })
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

        // Chargers does not use auto increment for chargeID, instead auto increments manually starting from 100 000.
        databaseInit.Chargers.max("chargerID")
            .then(function (biggestChargerID) {
                if (biggestChargerID != undefined && biggestChargerID != null && biggestChargerID != NaN && biggestChargerID >= 100000) {
                    charger.chargerID = biggestChargerID + 1;
                } else {
                    charger.chargerID = 100000;
                }

                databaseInit.Chargers.create(charger)
                    .then(createdCharger => callback([], createdCharger))
                    .catch(e => {
                        if (!e.errors === undefined) {
                            if (e.errors[0].message == "chargerID must be unique") {
                                charger.chargerID = parseInt(e.errors[0].value) + 1;
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

    exports.removeCharger = function (chargerID, callback) {
        databaseInit.Chargers.destroy({
            where: { chargerID: chargerID },
            raw: true
        })
            .then(deletedChargersAmount => {

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
    exports.updateChargerStatus = function (chargerID, status, callback) {
        databaseInit.Chargers.update({
            status: status
        }, {
            where: { chargerID: chargerID },
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