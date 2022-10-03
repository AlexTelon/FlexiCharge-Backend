const PubSub = require('pubsub-js')

module.exports = function ({ v, constants, func }) {
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
        const isPublished = PubSub.publish(topic, metricsMessage) // isPublished only represents if there are any subscribers to the topic!!!
        
        if(!isPublished){
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