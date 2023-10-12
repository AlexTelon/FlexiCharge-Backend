const PubSub = require('pubsub-js')
const config = require('../config')

module.exports = function ({ v, constants, func, databaseInterfaceTransactions, databaseInterfaceChargeSessions }) {
    const c = constants.get()

    exports.subcribeToLiveMetrics = function (userID, callback) {
        const token = PubSub.subscribe(`${c.LIVEMETRICS_TOPIC_PREFIX}${userID}`, function subscriptionListener(topic, message) { // TODO: add token to variables somehow
            userSocket = v.getConnectedUserSocket(userID)
            jsonMessage = func.buildJSONMessage(message)
            if (userSocket) {
                userSocket.send(jsonMessage)
            }
        })

        if (token) {
            v.addLiveMetricsToken(userID, token)
            callback([])
        } else {
            callback([c.INTERNAL_ERROR])
        }
    }

    exports.publishToLiveMetrics = function (userID, metricsMessage, callback) {
        const topic = `${c.LIVEMETRICS_TOPIC_PREFIX}${userID}`
        const thereIsSubscribers = PubSub.publish(topic, metricsMessage) // thereIsSubscribers only represents if there are any subscribers to the topic!!!

        const transactionID = metricsMessage[3].transactionId
        const currentTimestamp = metricsMessage[3].timestamp
        const lastDbTimestamp = v.getLastLiveMetricsTimestamp(transactionID)

        console.log('o-b-ptlm_0', transactionID, currentTimestamp, lastDbTimestamp, (currentTimestamp - lastDbTimestamp), config.LIVEMETRICS_DB_UPDATE_INTERVAL)

        if (!lastDbTimestamp || (currentTimestamp - lastDbTimestamp) >= config.LIVEMETRICS_DB_UPDATE_INTERVAL) {
            const chargingPercent = metricsMessage[3].values.chargingPercent.value
            const kWhTransferred = metricsMessage[3].values.chargedSoFar.value / 1000

            console.log(1, chargingPercent, kWhTransferred)

            databaseInterfaceTransactions.getTransaction(transactionID, function (errors, transaction) {
                if (errors.length > 0) { console.log(errors); return; } // HANDLE ERRORS
                if (transaction.length === 0) { return; }

                console.log(2)

                const chargeSessionID = transaction.chargeSessionID

                console.log(3)

                databaseInterfaceChargeSessions.updateChargingState(chargeSessionID, chargingPercent, kWhTransferred, function (error, updatedChargeSession) {
                    console.log('updatedChargeSession', updatedChargeSession);
                    if (error.length || !updatedChargeSession) {
                        console.log('Something went wrong when trying to update transaction from latest MeterValues in DB (transactionID: ' + chargeSessionID + ')')
                    } else {
                        v.updateLastLiveMetricsTimestamp(transactionID, currentTimestamp)
                    }
                })
            });
        } else {
            console.log('Update not in interval');
        }

        if (!thereIsSubscribers) {
            console.log('No subscribers to the following topic: ', topic)
        }
        callback()
    }

    exports.unsubscribeToLiveMetrics = function (userID) {
        const token = v.getLiveMetricsToken(userID)
        PubSub.unsubscribe(token)
        v.removeLiveMetricsToken(userID)
    }

    return exports
}
