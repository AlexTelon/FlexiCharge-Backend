const SequelizeMock = require("sequelize-mock")

module.exports = function({ newDatabaseInterfaceChargeSessions }) {

    const exports = {}

    const DBConnectionMock = new SequelizeMock();
    let ChargeSession = DBConnectionMock.define('newChargeSessions', {
        chargeSessionID : 1,
        userID : null,
        chargerID : null,
        kwhTransfered: null,
        currentChargePercentage : null,
        meterStart : null,
        startTime : null,
        endTime : null
    })


    exports.addChargeSessionTest = function(chargerID, userID, callback) {        
        newDatabaseInterfaceChargeSessions.addChargeSession(chargerID, userID, ChargeSession, (error) => {
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

        newDatabaseInterfaceChargeSessions.getChargeSession(chargeSessionID, ChargeSession, (error, chargeSession) => {
            const errorList = []

            error.forEach(err => {
                errorList.push(err)
            });

            if (chargeSession.dataValues.chargerID !== chargerID) {
                errorList.push("chargerID does not match intended output!")
            }

            if (chargeSession.dataValues.userID !== userID) {
                errorList.push("userID does not match intended output!")
            }
            callback(errorList)
        });
    }

    exports.updateChargingState = function(chargeSessionID, currentChargePercentage, kwhTransfered, callback) {
        newDatabaseInterfaceChargeSessions.updateChargingState(chargeSessionID, currentChargePercentage, kwhTransfered, ChargeSession, (error, updatedChargeSession) => {
            const errorList = []

            error.forEach(err => {
                errorList.push(err)
            });

            if (updatedChargeSession.dataValues.currentChargePercentage !== currentChargePercentage) {
                errorList.push("currentChargePercentage does not match intended output!")
            }

            if (updatedChargeSession.dataValues.kwhTransfered !== kwhTransfered) {
                errorList.push("kwhTransfered does not match intended output!")
            }

            callback(errorList)
        });
    }

    exports.runTests = function() {
        const FailedTests = []
        let amountOfTestsDone = 0
        let totalTests = Object.keys(exports).length - 1

        const checkIfAllTestsAreDone = function() {
            amountOfTestsDone++

            if (amountOfTestsDone >= totalTests) {
                if (FailedTests.length == 0) {
                    console.log(`All Charge Sessions Tests succeeded!`);
                } else {
                    console.log(`Charge Sessions tests had ${FailedTests.length} failed tests!`);
                    FailedTests.forEach(message => {
                        console.log(message);
                    });
                }
            }
        }

        exports.updateChargingState(1, 10, 1000, (errors) => {
            errors.forEach(e => {
                FailedTests.push(`updateChargingState Failed! : ${e}`);
            });
            checkIfAllTestsAreDone()
        })

        exports.addChargeSessionTest(10, 10, (errors) => {
            errors.forEach(e => {
                FailedTests.push(`addChargeSessionTest Failed! : ${e}`);
            });
            checkIfAllTestsAreDone()
        })

        exports.getChargeSessionTest(1, (errors) => {
            errors.forEach(e => {
                FailedTests.push(`getChargeSessionTest Failed! : ${e}`);
            });
            checkIfAllTestsAreDone()
        })

        
    }

    return exports
}
