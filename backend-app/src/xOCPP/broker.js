const PubSub = require('pubsub-js')

module.exports = function ({ v, constants, func }) {
    const c = constants.get()

    exports.subcribeToLiveMetrics = function(userID, callback){  
        const token = PubSub.subscribe(`${c.LIVEMETRICS_TOPIC_PREFIX}${userID}`, function subscriptionListener(topic, message){ // TODO: add token to variables somehow
            userSocket = v.getConnectedUserSocket(userID)

            jsonMessage = func.buildJSONMessage(message)
            if(userSocket) userSocket.send(jsonMessage)
        }) 
        if(token){
            v.addLiveMetricsToken(userID, token)
            callback([])
        } else {
            callback([c.INTERNAL_ERROR])
        } 
    }

    exports.publishToLiveMetrics = function(userID, metricsMessage, callback){
        const isPublished = PubSub.publish(`${c.LIVEMETRICS_TOPIC_PREFIX}${userID}`, metricsMessage)
        if(isPublished){
            callback([])
        } else {
            callback([c.INTERNAL_ERROR])
        }
    }

    exports.unsubscribeToLiveMetrics = function(token){
        PubSub.unsubscribe(token)
    }

    return exports
}