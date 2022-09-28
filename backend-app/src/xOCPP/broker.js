const PubSub = require('pubsub-js')

module.exports = function ({ v, constants, func }) {
    const c = constants.get()

    exports.subcribeToLiveMetrics = function(userID){  
        const token = PubSub.subscribe(`${c.LIVEMETRICS_TOPIC_PREFIX}${userID}`, function subscriptionListener(topic, message){ // TODO: add token to variables somehow
            console.log("RECIEVED MESSAGE: " + topic + " RECEIVED A DATA: " + message)

            userSocket = v.getConnectedUserSocket(userID)

            jsonMessage = func.buildJSONMessage(message)
            userSocket.send(jsonMessage)
        }) 

        v.addLiveMetricsToken(userID, token)
    }

    exports.publishToLiveMetrics = function(userID, metricsMessage){
        PubSub.publish(`${c.LIVEMETRICS_TOPIC_PREFIX}${userID}`, metricsMessage)
        console.log(`PUBLISH TO: ${c.LIVEMETRICS_TOPIC_PREFIX}${userID}`)
    }

    exports.unsubscribeToLiveMetrics = function(token){
        PubSub.unsubscribe(token)
    }

    return exports
}