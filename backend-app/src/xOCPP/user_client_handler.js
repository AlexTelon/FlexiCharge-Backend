module.exports = function ({ constants, func, broker, v }) {
    const c = constants.get()

    exports.handleClient = function (clientSocket, userID) {
        if(!isValidClient(userID)){
            const jsonErrorMessage = func.buildJSONMessage([
                c.CALL_ERROR,
                420,
                c.SECURITY_ERROR,
                'userID is invalid',
                {}
            ])
            clientSocket.send(jsonErrorMessage)
            clientSocket.terminate()
            return
        }

        v.addConnectedUserSocket(userID, clientSocket)
        broker.subcribeToLiveMetrics(userID)
        
        console.log("User client with ID: " + userID + " connected to the system.")
        console.log("Number of connected user clients: " + v.getLengthConnectedUserSockets())
    }

    isValidClient = function (userID){
        //TODO: Implement!!!
        //Probably some form of authentication using Cognito

        return true
    }

    return exports
}