module.exports = function({ databaseInit }) {

    const exports = {}

    exports.getChargers = function(database, callback) {
        if (database == null) {
            database = databaseInit.newChargers
        }

        database.findAll({ raw: true })
            .then(chargers => callback([], chargers))
            .catch(e => {
                console.log(e)
                callback(e, [])
            })
    }

    exports.getCharger = function(chargerID, database, callback) {
        if (database == null) {
            database = databaseInit.newChargers
        }

        database.findOne({ where: { chargerID: chargerID }, raw: true })
            .then(charger => callback([], charger))
            .catch(e => {
                console.log(e)
                callback(e, [])
            })
    }

    exports.getChargerBySerialNumber = function(serialNumber, database, callback) {
        if (database == null) {
            database = databaseInit.newChargers
        }

        database.findOne({ where: { serialNumber: serialNumber }, raw: true })
            .then(charger => callback([], charger))
            .catch(e => {
                console.log(e)
                callback(e, [])
            })
    }

    exports.getAvailableChargers = function(database, callback) {
        if (database == null) {
            database = databaseInit.newChargers
        }

        database.findAll({ where: { status: 'Available' }, raw: true })
            .then(chargers => callback([], chargers))
            .catch(e => {
                console.log(e)
                callback(e, [])
            })
    }

    exports.addCharger = function(chargePointID, serialNumber, coordinates, database, callback) {
        if (database == null) {
            database = databaseInit.newChargers
        }

        const charger = {
            chargePointID: chargePointID,
            serialNumber: serialNumber,
            coordinates: coordinates,
            status: 'Reserved'
        }

        // Chargers does not use auto increment for chargeID, instead auto increments manually starting from 100 000.
        database.max("chargerID")
            .then(function(biggestChargerID) {
                if (biggestChargerID != undefined && biggestChargerID != null && biggestChargerID != NaN && biggestChargerID >= 100000) {
                    charger.chargerID = biggestChargerID + 1;
                } else {
                    charger.chargerID = 100000;
                }

                database.create(charger)
                    .then(createdCharger => callback([], createdCharger.chargerID))
                    .catch(e => {
                        if (!e.errors === undefined) {
                            if (e.errors[0].message == "chargerID must be unique") {
                                charger.chargerID = parseInt(e.errors[0].value) + 1;
                                database.create(charger)
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

    exports.removeCharger = function(chargerID, database, callback) {
        if (database == null) {
            database = databaseInit.newChargers
        }

        database.destroy({
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
    exports.updateChargerStatus = function(chargerID, status, database, callback) {
        if (database == null) {
            database = databaseInit.newChargers
        }
        database.update({
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