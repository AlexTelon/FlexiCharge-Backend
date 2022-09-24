module.exports = function({ databaseInit }) {

    const exports = {}

    exports.getAllChargers = function(callback) {
        databaseInit.newChargers.findAll({ raw: true })
            .then(chargers => callback([], chargers))
            .catch(e => {
                console.log(e)
                callback(e, [])
            })
    }

    exports.getCharger = function(chargerId, callback) {
        databaseInit.newChargers.findOne({ where: { chargerID: chargerId }, raw: true })
            .then(charger => callback([], charger))
            .catch(e => {
                console.log(e)
                callback(e, [])
            })
    }

    exports.getChargerBySerialNumber = function(serialNumber, callback) {
        databaseInit.newChargers.findOne({ where: { serialNumber: serialNumber }, raw: true })
            .then(charger => callback([], charger))
            .catch(e => {
                console.log(e)
                callback(e, [])
            })
    }

    exports.getAvailableChargers = function(callback) {
        databaseInit.newChargers.findAll({ where: { status: 'Available' }, raw: true })
            .then(chargers => callback([], chargers))
            .catch(e => {
                console.log(e)
                callback(e, [])
            })
    }

    exports.addCharger = function(chargePointId, serialNumber, coordinates, callback) {
        const charger = {
            chargePointID: chargePointId,
            serialNumber: serialNumber,
            coordinates: coordinates,
            status: 'Reserved'
        }

        // Chargers does not use auto increment for chargeID, instead auto increments manually starting from 100 000.
        databaseInit.newChargers.max("chargerID")
            .then(function(biggestChargerID) {
                if (biggestChargerID != undefined && biggestChargerID != null && biggestChargerID != NaN && biggestChargerID >= 100000) {
                    charger.chargerID = biggestChargerID + 1;
                } else {
                    charger.chargerID = 100000;
                }

                console.log(charger);

                databaseInit.newChargers.create(charger)
                    .then(createdCharger => callback([], createdCharger.chargerID))
                    .catch(e => {
                        if (!e.errors === undefined) {
                            if (e.errors[0].message == "chargerID must be unique") {
                                charger.chargerID = parseInt(e.errors[0].value) + 1;
                                databaseInit.newChargers.create(charger)
                                    .then(createdCharger => callback([], createdCharger.chargerID))
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

    exports.removeCharger = function(chargerId, callback) {
        databaseInit.newChargers.destroy({
                where: { chargerID: chargerId },
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
    exports.updateChargerStatus = function(chargerId, status, callback) {
        databaseInit.newChargers.update({
                status: status
            }, {
                where: { chargerID: chargerId },
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