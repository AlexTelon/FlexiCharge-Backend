module.exports = function({ databaseInit }) {

    const exports = {}

    exports.addChargeSession = function(chargerID, userID, database, callback) {
        if (database == null) {
            database = databaseInit.newChargeSessions
        }

        const chargeSession = {
            chargerID: chargerID,
            userID: userID,
            currentChargePercentage: null,
            kwhTransfered : null
        }

        database.create(chargeSession)
            .then(chargeSession => callback([], chargeSession.chargeSessionID))
            .catch(e => {
                console.log(e)
                callback(e, [])
            })
    }

    exports.getChargeSession = function(chargeSessionID, database, callback) {
        if (database == null) {
            database = databaseInit.newChargeSessions
        }

        database.findOne({ where: {chargeSessionID : chargeSessionID}, raw: true })
            .then(chargeSession => callback([], chargeSession))
            .catch(e => {
                console.log(e)
                callback(e, [])
            })
    }

    exports.getChargeSessions = function(chargerID, database, callback) {
        if (database == null) {
            database = databaseInit.newChargeSessions
        }

        database.findAll({ where: {chargerID : chargerID}, raw: true })
            .then(ChargeSessions => callback([], ChargeSessions))
            .catch(e => {
                console.log(e)
                callback(e, [])
            })
    }

    exports.updateChargingState = function(chargeSessionID, currentChargePercentage, kwhTransfered, database, callback) {
        if (database == null) {
            database = databaseInit.newChargeSessions
        }

        database.update({ 
            kwhTransfered : kwhTransfered,
            currentChargePercentage : currentChargePercentage
        }, {
            where: {chargeSessionID : chargeSessionID},
            raw: true,
            returning : true
        }).then(updatedChargeSession => {
            callback([], updatedChargeSession[1][0])
        }).catch(e => {
            console.log(e)
            callback(e, [])
        })
    }

    return exports
}