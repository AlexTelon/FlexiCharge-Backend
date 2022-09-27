const SequelizeMock = require("sequelize-mock")

module.exports = function({ newDatabaseInterfaceChargers }) {

    const exports = {}

    const DBConnectionMock = new SequelizeMock();

    const chargersDefaultValue = {
        chargerID : 100000,
        coordinates : [57.749812214261034,14.070100435207065],
        serialNumber : "abc123",
        status : 'Available'
    }

    let Chargers = DBConnectionMock.define('newChargers', chargersDefaultValue)

    exports.getChargersTest = function(callback) {        
        newDatabaseInterfaceChargers.getChargers(Chargers, (error, chargers) => {
            const errorList = []

            error.forEach(err => {
                errorList.push(err)
            });

            if (chargers.length !== 1) {
                errorList.push(`Only fetched ${chargers.length} chargers...`)
            }

            callback(errorList)
        })
    }

    exports.getChargerTest = function(chargerID, callback) {        
        const serialNumber = "abc111"
        Chargers.$queueResult(Chargers.build({chargerID : chargerID, serialNumber: serialNumber}))

        newDatabaseInterfaceChargers.getCharger(chargerID, Chargers, (error, charger) => {
            const errorList = []

            error.forEach(err => {
                errorList.push(err)
            });

            if (charger.dataValues.serialNumber !== serialNumber) {
                errorList.push("Did not fetch correct charger")
            }

            callback(errorList)
        })
    }

    exports.getChargerBySerialNumberTest = function(serialNumber, callback) {
        const chargerID = 101337
        Chargers.$queueResult(Chargers.build({chargerID : chargerID, serialNumber: serialNumber}))

        newDatabaseInterfaceChargers.getChargerBySerialNumber(serialNumber, Chargers, (error, charger) => {
            const errorList = []

            error.forEach(err => {
                errorList.push(err)
            });

            if (charger.dataValues.chargerID !== chargerID) {
                errorList.push("Did not fetch correct charger")
            }

            callback(errorList)
        })
    }

    exports.getAvailableChargersTest = function(callback) {
        newDatabaseInterfaceChargers.getAvailableChargers(Chargers, (error, chargers) => {
            const errorList = []

            error.forEach(err => {
                errorList.push(err)
            });

            if (chargers.length !== 1) {
                errorList.push("")
            }

            callback(errorList)
        })
    }

    exports.addChargerTest = function(chargePointID, serialNumber, coordinates, callback) {
        newDatabaseInterfaceChargers.addCharger(chargePointID, serialNumber, coordinates, Chargers, (error, chargerID) => {
            const errorList = []

            error.forEach(err => {
                errorList.push(err)
            });

            if (chargerID !== chargersDefaultValue.chargerID + 1) {
                errorList.push(`Added charger does not have correct chargerID`)
            }

            callback(errorList)
        })
    }

    exports.removeChargerTest = function(chargerID, callback) {
        newDatabaseInterfaceChargers.removeCharger(chargerID, Chargers, (error, chargerRemoved) => {
            const errorList = []

            error.forEach(err => {
                errorList.push(err)
            });

            if (!chargerRemoved) {
                errorList.push("Charger was not removed!")
            }

            callback(errorList)
        })
    }


    exports.runTests = function() {
        const FailedTests = []

        exports.getChargersTest((error) => {
            error.forEach(e => {
                FailedTests.push(`getChargers Failed ! ${e}`)
            })
        })

        exports.getChargerTest(1, (error) => {
            error.forEach(e => {
                FailedTests.push(`getChargerTest Failed ! ${e}`)
            })
        })

        exports.getChargerBySerialNumberTest("abc111", (error) => {
            error.forEach(e => {
                FailedTests.push(`getChargerBySerialNumberTest Failed ! ${e}`)
            })
        })

        exports.getAvailableChargersTest((error) => {
            error.forEach(e => {
                FailedTests.push(`getAvailableChargersTest Failed ! ${e}`)
            })
        })

        exports.addChargerTest(1, "abc999", [39.749812214261034,39.070100435207065], (error) => {
            error.forEach(e => {
                FailedTests.push(`addChargerTest Failed ! ${e}`)
            })
        })

        exports.removeChargerTest(chargersDefaultValue.chargerID, (error) => {
            error.forEach(e => {
                FailedTests.push(`removeChargerTest Failed ! ${e}`)
            })
        })

        if (FailedTests.length == 0) {
            console.log(`All Chargers Tests succeeded!`);
        } else {
            console.log(`Chargers tests had ${FailedTests.length} failed tests!`);
            FailedTests.forEach(message => {
                console.log(message);
            });
        }
    }

    return exports
}
