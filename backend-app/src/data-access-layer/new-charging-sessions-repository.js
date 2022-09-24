module.exports = function({ databaseInit }) {

    const exports = {}

    exports.addChargeSession = function(chargerID, userID, currentChargePercentage, callback) {
        // TODO addChargeSession
    }

    exports.getChargeSession = function(chargeSessionID, callback) {
        // TODO getChargeSession
    } 

    exports.updatekwhTransfered = function(chargeSessionID, newTotalkwhTransfered, callback) {
        // TODO updatekwhTransfered
    }

    exports.updateCurrentChargePercentage = function(chargeSessionID, newCurrentChargePercentage, callback) {
        // TODO updateCurrentChargePercentage
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