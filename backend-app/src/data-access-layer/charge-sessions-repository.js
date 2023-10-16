module.exports = function ({ databaseInit }) {

    const exports = {}

    exports.addChargeSession = function (connectorID, userID, callback) {
        const chargeSession = {
            connectorID: connectorID,
            userID: userID,
            currentChargePercentage: null,
            kWhTransferred: null,
            startTime: null,
            meterStart: null,
        }

        databaseInit.ChargeSessions.create(chargeSession)
            .then(chargeSession => callback([], chargeSession))
            .catch(e => {
                console.log(e)
                callback(e, [])
            })
    }

    exports.getChargeSession = function (chargeSessionID, callback) {
        databaseInit.ChargeSessions.findOne({ where: { chargeSessionID: chargeSessionID }, raw: true })
            .then(chargeSession => callback([], chargeSession))
            .catch(e => {
                console.log(e)
                callback(e, [])
            })
    }

    exports.getChargeSessions = function (connectorID, callback) {
        databaseInit.ChargeSessions.findAll({ where: { connectorID: connectorID }, raw: true })
            .then(ChargeSessions => callback([], ChargeSessions))
            .catch(e => {
                console.log(e)
                callback(e, [])
            })
    }

    exports.updateChargeSession = function (chargeSessionID, updatedProperties, callback) {
        databaseInit.ChargeSessions.update(updatedProperties, {
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

    exports.updateChargingState = function (chargeSessionID, currentChargePercentage, kWhTransferred, callback) {
        databaseInit.ChargeSessions.update({
            kWhTransferred: kWhTransferred,
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

    exports.updateMeterStart = function (chargeSessionID, startTime, meterStart, callback) {
        console.log('csr-umsa_0', startTime, meterStart);
        databaseInit.ChargeSessions.update({
            startTime: startTime,
            meterStart: meterStart,
        }, {
            where: { chargeSessionID: chargeSessionID },
            raw: true,
            returning: true
        }).then(updatedChargeSession => {
            updatedChargeSession = updatedChargeSession[1][0]
            console.log('csr-umsa_1', updatedChargeSession)
            callback([], updatedChargeSession)
        }).catch(e => {
            console.log(e)
            callback(e, [])
        })
    }

    exports.updateMeterStop = function (chargeSessionID, endTime, kWhTransferred, callback) {
        console.log('csr-umso_0', endTime, kWhTransferred);
        databaseInit.ChargeSessions.update({
            endTime: endTime,
            kWhTransferred: kWhTransferred,
        }, {
            where: { chargeSessionID: chargeSessionID },
            raw: true,
            returning: true
        }).then(updatedChargeSession => {
            updatedChargeSession = updatedChargeSession[1][0]
            console.log('csr-umso_1', updatedChargeSession)
            callback([], updatedChargeSession)
        }).catch(e => {
            console.log(e)
            callback(e, [])
        })
    }

    return exports
}
