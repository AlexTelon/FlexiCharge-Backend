module.exports = function({ databaseInit }) {

    const exports = {}

    exports.addChargeSession = function(chargerID, userID, database, callback) {
        if (database == null) {
            database = databaseInit.newChargeSessions
        }

        // TODO addChargeSession
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

        // TODO getChargeSession
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
        // TODO updateChargingState
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

    // Maybe Delete ChargeSession endpoint??

    // Live Metrics??

    // exports.getTransactionsForCharger = function(chargerID, callback) {
    //     databaseInit.newTransactions.findAll({ where: { chargerID: chargerID }, raw: true })
    //         .then(chargerTransaction => callback([], chargerTransaction))
    //         .catch(e => {
    //             console.log(e)
    //             callback(e, [])
    //         })
    // }

    // exports.addKlarnaTransaction = function(userID, chargerID, pricePerKwh, session_id, client_token, isKlarnaPayment, timestamp, paymentConfirmed, callback){
        
    //     const klarnaTransaction = {
    //         userID: userID,
    //         chargerID: chargerID,
    //         pricePerKwh: pricePerKwh,
    //         session_id: session_id,
    //         client_token: client_token,
    //         paymentConfirmed: paymentConfirmed,
    //         isKlarnaPayment: isKlarnaPayment,
    //         timestamp: timestamp
    //     }
    //     databaseInit.newTransactions.create(klarnaTransaction, {
    //             returning: true,
    //             raw: true
    //         })
    //         .then(klarnaTransaction => callback([], klarnaTransaction))
    //         .catch(e => {
    //             console.log(e)
    //             callback(e, [])
    //         })
    // }

    return exports
}