const SequelizeMock = require("sequelize-mock")

module.exports = function({ newDatabaseInterfaceChargeSessions }) {

    const exports = {}

    const DBConnectionMock = new SequelizeMock();
    let ChargeSession = DBConnectionMock.define('newChargeSessions', {
        userID : null,
        chargerID : null,
        kwhTransfered: null,
        currentChargePercentage : null,
        meterStart : null,
        startTime : null,
        endTime : null
    })


    exports.addChargeSessionTest = function(chargerID, userID, callback) {        
        newDatabaseInterfaceChargeSessions.addChargeSession(chargerID, userID, ChargeSession, (error, result) => {
            const errorList = []

            error.forEach(err => {
                errorList.push(err)
            });

            callback(errorList)
        })
    }

    exports.getChargeSessionTest = function(chargeSessionID, callback) {
        const chargerID = 10
        const userID = 1337
        
        ChargeSession.$queueResult(ChargeSession.build({chargerID : chargerID, userID : userID}))

        newDatabaseInterfaceChargeSessions.getChargeSession(chargeSessionID, ChargeSession, (error, result) => {
            const errorList = []

            error.forEach(err => {
                errorList.push(err)
            });

            if (result.dataValues.chargerID !== chargerID) {
                errorList.push("chargerID does not match intended output!")
            }

            if (result.dataValues.userID !== userID) {
                errorList.push("userID does not match intended output!")
            }
            callback(errorList)
        });
    }

    exports.updateChargingState = function(chargeSessionID, currentChargePercentage, kwhTransfered, callback) {
        newDatabaseInterfaceChargeSessions.updateChargingState(chargeSessionID, currentChargePercentage, kwhTransfered, ChargeSession, (error, result) => {
            const errorList = []

            error.forEach(err => {
                errorList.push(err)
            });

            if (result.dataValues.currentChargePercentage !== currentChargePercentage) {
                errorList.push("currentChargePercentage does not match intended output!")
            }

            if (result.dataValues.kwhTransfered !== kwhTransfered) {
                errorList.push("kwhTransfered does not match intended output!")
            }

            callback(errorList)
        });
    }

    exports.runTests = function() {
        const FailedTests = []

        exports.updateChargingState(1, 10, 1000, (error) => {
            error.forEach(err => {
                FailedTests.push(`addChargeSessionTest Failed! : ${err}`);
            });
        })

        exports.addChargeSessionTest(10, 10, (error) => {
            error.forEach(err => {
                FailedTests.push(`addChargeSessionTest Failed! : ${err}`);
            });
        })

        exports.getChargeSessionTest(1, (error) => {
            error.forEach(err => {
                FailedTests.push(`getChargeSessionTest Failed! : ${err}`);
            });
        })

        if (FailedTests.length == 0) {
            console.log(`All Charge Sessions Tests succeeded!`);
        } else {
            console.log(`Transaction tests had ${FailedTests.length} failed tests!`);
            FailedTests.forEach(message => {
                console.log(message);
            });
        }
    }

    return exports
}
