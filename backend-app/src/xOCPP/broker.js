
module.exports = function ({ v, constants, func }) {
    const c = constants.get()

    exports.subcribeToLiveMetrics = function(userID){
        const subscriber = function(message, data) {
            console.log(message, data)
        }

        const token = PubSub.subscribe(`${c.LIVEMETRICS_TOPIC_PREFIX}${userID}`, subscriber) // TODO: add token to variables somehow
    }

    exports.publishToLiveMetrics = function(userID, metricsMessage){
        PubSub.publish(`${c.LIVEMETRICS_TOPIC_PREFIX}${userID}`, metricsMessage)
    }

    exports.unsubscribeToLiveMetrics = function(token){
        PubSub.unsubscribe(token)
    }

    return exports
}