
module.exports = function ({ constants, func, broker, v }) {
    const c = constants.get()

    exports.handleClient = function (clientSocket, userID) {
        v.addConnectedUserSocket(userID, clientSocket)

        broker.subcribeToLiveMetrics(userID, function(error){
            if(error.length > 0){
                console.log("User client with ID: " + userID + " couldn't connect to the system.")
                const message = func.buildJSONMessage([c.CALL_ERROR, 1337, c.INTERNAL_ERROR, "Couldn't subscribe to live metrics", {}])
                clientSocket.send(message)
                clientSocket.terminate()
            } else {
                console.log("User client with ID: " + userID + " connected to the system.")
                console.log("Number of connected user clients: " + v.getLengthConnectedUserSockets())
            }
        })

        //THIS RUNS AFTER TERMINATE IN CASE OF ERROR!!!!
        clientSocket.on('close', function disconnection() {
            console.log("closing")

            v.removeConnectedUserSocket(userID)
            broker.unsubscribeToLiveMetrics(userID)

            if(v.isInUserIDs(userID)){
                v.removeUserID(userID)
            }

            console.log("Disconnected from client with ID: " + userID)
            console.log("Number of connected clients: " + v.getLengthConnectedUserSockets())
        })   
    }

    return exports
}