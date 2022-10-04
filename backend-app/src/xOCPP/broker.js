const PubSub = require('pubsub-js')

module.exports = function ({ v, constants, func, databaseInterfaceTransactions }) {
    const c = constants.get()

    exports.subcribeToLiveMetrics = function(userID, callback){
        const token = PubSub.subscribe(`${c.LIVEMETRICS_TOPIC_PREFIX}${userID}`, function subscriptionListener(topic, message){ // TODO: add token to variables somehow
            userSocket = v.getConnectedUserSocket(userID)
            jsonMessage = func.buildJSONMessage(message)
            if(userSocket){
                userSocket.send(jsonMessage)
            }
        }) 

        if(token){
            v.addLiveMetricsToken(userID, token)
            callback([])
        } else {
            callback([c.INTERNAL_ERROR])
        } 
    }

    exports.publishToLiveMetrics = function(userID, metricsMessage, callback){
        const topic = `${c.LIVEMETRICS_TOPIC_PREFIX}${userID}`
        const thereIsSubscribers = PubSub.publish(topic, metricsMessage) // thereIsSubscribers only represents if there are any subscribers to the topic!!!
        
        const transactionID = metricsMessage[3].transactionId
        const currentTimestamp = metricsMessage[3].timestamp
        const lastDbTimestamp = v.getLastLiveMetricsTimestamp(transactionID)

        if(lastDbTimestamp && (currentTimestamp - lastDbTimestamp) >= c.LIVEMETRICS_DB_UPDATE_INTERVAL){
            const chargingPercent = metricsMessage[3].values.chargingPercent.value
            const chargedSoFarWh = metricsMessage[3].values.chargedSoFar.value // comes in Wh instead of KWh

            databaseInterfaceTransactions.updateTransactionChargingStatus(transactionID, chargedSoFarWh, chargingPercent, function(error, updatedTransaction){
                if(error.length || !updatedTransaction){
                    console.log('Something went wrong when trying to update transaction from latest MeterValues in DB (transactionID: '+ transactionID + ')')
                } else {
                    v.updateLastLiveMetricsTimestamp(transactionID, currentTimestamp)
                }
            })
        } else if(!lastDbTimestamp){
            v.updateLastLiveMetricsTimestamp(transactionID, currentTimestamp)
        }

        if(!thereIsSubscribers){
            console.log('No subscribers to the following topic: ', topic)
        }
        callback()
    }

    exports.unsubscribeToLiveMetrics = function(userID){
        const token = v.getLiveMetricsToken(userID)
        PubSub.unsubscribe(token)
        v.removeLiveMetricsToken(userID)
    }

    return exports
}