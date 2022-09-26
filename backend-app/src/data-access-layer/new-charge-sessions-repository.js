module.exports = function({ databaseInit }) {

    const exports = {}

    exports.addChargeSession = function(chargerID, userID, callback) {
        // TODO addChargeSession
        const chargeSession = {
            chargerID: chargerID,
            userID: userID,
            currentChargePercentage: null,
            kwhTransfered : null
        }

        databaseInit.newChargingSessions.create(chargeSession)
            .then(chargeSession => callback([], chargeSession.chargeSessionID))
            .catch(e => {
                console.log(e)
                callback(e, [])
            })
    }

    exports.getChargeSession = function(chargeSessionID, callback) {
        // TODO getChargeSession
        databaseInit.newChargingSessions.findOne({ where: {chargeSessionID : chargeSessionID}, raw: true })
            .then(chargeSession => callback([], chargeSession))
            .catch(e => {
                console.log(e)
                callback(e, [])
            })
    } 

    exports.updateChargingState = function(chargeSessionID, currentChargePercentage, kwhTransfered) {
        // TODO updateChargingState
        databaseInit.newChargingSessions.update({ 
            kwhTransfered : kwhTransfered,
            currentChargePercentage : currentChargePercentage
        }, {
            where: {chargeSessionID : chargeSessionID},
            raw: true,
            returning : true
        }).then(chargeSession => {
            if (chargeSession == null) {
                callback([], chargeSession)
            } else {
                callback([], chargeSession)
            }
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