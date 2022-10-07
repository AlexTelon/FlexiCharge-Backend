module.exports = function ({ databaseInit }) {

    const exports = {}

    exports.addChargeSession = function (chargerID, userID, startTime, callback) {
        const chargeSession = {
            chargerID: chargerID,
            userID: userID,
            currentChargePercentage: null,
            kwhTransfered: null,
            startTime: startTime
        }

        databaseInit.newChargeSessions.create(chargeSession)
            .then(chargeSession => callback([], chargeSession))
            .catch(e => {
                console.log(e)
                callback(e, [])
            })
    }

    exports.getChargeSession = function (chargeSessionID, callback) {
        databaseInit.newChargeSessions.findOne({ where: { chargeSessionID: chargeSessionID }, raw: true })
            .then(chargeSession => callback([], chargeSession))
            .catch(e => {
                console.log(e)
                callback(e, [])
            })
    }

    exports.getChargeSessions = function (chargerID, callback) {
        databaseInit.newChargeSessions.findAll({ where: { chargerID: chargerID }, raw: true })
            .then(ChargeSessions => callback([], ChargeSessions))
            .catch(e => {
                console.log(e)
                callback(e, [])
            })
    }

    exports.updateChargeSession = function (chargeSessionID, updatedProperties, callback) {
        databaseInit.newChargeSessions.update(updatedProperties, {
            where: {
                chargeSessionID: chargeSessionID
            },
            raw: true,
            returning: true
        }).then(updatedChargeSession => {
            callback([], updatedChargeSession)
        }).catch(e => {
            console.log(e)
            callback(e, [])
        })
    }

    exports.updateChargingEndTime = function (chargeSessionID, endTime, callback) {
        databaseInit.newChargeSessions.update({
            endTime: endTime
        }, {
            where: { chargeSessionID: chargeSessionID },
            raw: true,
            returning: true
        }).then(updatedChargeSession => {
            callback([], updatedChargeSession)
        }).catch(e => {
            console.log(e)
            callback(e, [])
        })
    }

    exports.updateChargingState = function (chargeSessionID, currentChargePercentage, kwhTransfered, callback) {
        databaseInit.newChargeSessions.update({
            kwhTransfered: kwhTransfered,
            currentChargePercentage: currentChargePercentage
        }, {
            where: { chargeSessionID: chargeSessionID },
            raw: true,
            returning: true
        }).then(updatedChargeSession => {
            callback([], updatedChargeSession)
        }).catch(e => {
            console.log(e)
            callback(e, [])
        })
    }

    exports.updateMeterStart = function (chargeSessionID, meterStart, callback) {
        databaseInit.newChargeSessions.update({
            meterStart: meterStart,
        }, {
            where: { chargeSessionID: chargeSessionID },
            raw: true,
            returning: true
        }).then(updatedChargeSession => {
            callback([], updatedChargeSession)
        }).catch(e => {
            console.log(e)
            callback(e, [])
        })
    }

    return exports
}