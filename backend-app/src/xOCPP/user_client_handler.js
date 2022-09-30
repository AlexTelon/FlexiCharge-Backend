module.exports = function ({ constants, func, broker, v }) {
    const c = constants.get()

    exports.handleClient = function (clientSocket, userID) {
        v.addConnectedUserSocket(userID, clientSocket)
        broker.subcribeToLiveMetrics(userID)
        
        console.log("User client with ID: " + userID + " connected to the system.")
        console.log("Number of connected user clients: " + v.getLengthConnectedUserSockets())
    }

    return exports
}