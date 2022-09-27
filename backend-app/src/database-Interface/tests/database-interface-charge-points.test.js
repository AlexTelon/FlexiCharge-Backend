const SequelizeMock = require("sequelize-mock")

module.exports = function({ newDatabaseInterfaceChargePoints }) {

    const exports = {}

    const DBConnectionMock = new SequelizeMock();
    let ChargePoints = DBConnectionMock.define('newChargePoints', {
        chargePointID : 1,
        name : "Coop, Forserum",
        address : "Värnamovägen",
        location : [57.70022044183724,14.475150415104222],
        price: 10.15
    })

    exports.getChargePointTest = function(chargePointId, callback) {        
        newDatabaseInterfaceChargePoints.getChargePoint(chargePointId, ChargePoints, (error, chargePoint) => {
            const errorList = []

            error.forEach(err => {
                errorList.push(err)
            });

            if (chargePoint == null) {
                errorList.push("Could not fetch chargePoint")
            }

            callback(errorList)
        })
    }

    exports.getChargePointsTest = function(callback) {        
        newDatabaseInterfaceChargePoints.getChargePoints(ChargePoints, (error, chargePoints) => {
            const errorList = []

            error.forEach(err => {
                errorList.push(err)
            });

            if (chargePoints == null || chargePoints.length < 1) {
                errorList.push("Could not fetch chargePoint")
            }

            callback(errorList)
        })
    }

    exports.addChargePointTest = function(name, address, coordinates, callback) {
        newDatabaseInterfaceChargePoints.addChargePoint(name, address, coordinates, ChargePoints, (error, chargePointID) => {
            const errorList = []

            error.forEach(err => {
                errorList.push(err)
            });

            if (chargePointID === null || chargePointID.length == 0) {
                errorList.push("Could not add charge point")
            }

            callback(errorList)
        })
    }

    exports.removeChargePointTest = function(chargePointID, callback) {
        newDatabaseInterfaceChargePoints.removeChargePoint(chargePointID, ChargePoints, (error, chargePointID) => {
            const errorList = []

            error.forEach(err => {
                errorList.push(err)
            });

            if (chargePointID === null || chargePointID.length == 0) {
                errorList.push("Could not remove point")
            }

            callback(errorList)
        })
    }

    exports.updateChargePointTest = function(chargePointID, name, location, price, callback) {
        newDatabaseInterfaceChargePoints.updateChargePoint(chargePointID, name, location, price, ChargePoints, (error, updatedChargePoint) => {
            const errorList = []

            error.forEach(err => {
                errorList.push(err)
            });

            callback(errorList)
        })
    }


    exports.runTests = function() {
        const FailedTests = []

        exports.getChargePointTest(1, (error) => {
            error.forEach(e => {
                FailedTests.push(`getChargePointTest Failed ! ${e}`)
            })
        })

        exports.getChargePointsTest((error) => {
            error.forEach(e => {
                FailedTests.push(`getChargePointsTest Failed ! ${e}`)
            })
        })

        exports.addChargePointTest("ICA", "Zeusvägen", [55.136461, 17.125360], (error) => {
            error.forEach(e => {
                FailedTests.push(`addChargePointTest Failed ! ${e}`)
            })
        })

        exports.removeChargePointTest(1, (error) => {
            error.forEach(e => {
                FailedTests.push(`removeChargePointTest Failed ! ${e}`)
            })
        })

        exports.updateChargePointTest(1, "ICA", [56.014765,19.023512], 10.15, (error) => {
            error.forEach(e => {
                FailedTests.push(`updateChargePointTest Failed ! ${e}`)
            })
        })

        if (FailedTests.length == 0) {
            console.log(`All Charge Points Tests succeeded!`);
        } else {
            console.log(`Charge Points tests had ${FailedTests.length} failed tests!`);
            FailedTests.forEach(message => {
                console.log(message);
            });
        }
    }

    return exports
}
