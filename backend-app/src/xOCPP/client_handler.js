module.exports = function({databaseInterfaceCharger, messageHandler}) {

    exports.handleConnection = function(newSocket, chargerSerial, connectedChargers) {
        databaseInterfaceCharger.getChargerByChargePointId(chargerSerial, function(errorCodes, charger){
            if (errorCodes.length) {
                console.log(errorCodes)
            } else {
                if (charger == null) {
                    console.log("Charger with serial # " + chargerSerial + " was refused connection. Reason: Not found in system.")
                    // TODO: Skicka error till laddaren
                    newSocket.close()
                } else {
                    console.log("Charger with ID: " + charger.chargerID + " connected to the system.")
                    
                    // Else, save the websocket with the charger's serial in array:
                    connectedChargers.push({
                        chargerID : newSocket
                    })
                    
                    // Log to console
                    console.log("Incoming connection from charger with ID: " + chargerSerial)
                    console.log("Number of connected chargers: " + connectedChargers.length)
    
                    messageHandler.handleMessage(newSocket)
                    // TODO: Skicka "success" med charger ID etc. till laddaren
                }
            }
        })
    }
    return exports
}