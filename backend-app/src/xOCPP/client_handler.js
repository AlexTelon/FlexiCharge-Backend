module.exports = function({databaseInterfaceCharger, messageHandler}) {

    exports.handleConnection = function(newSocket, chargerSerial, connectedChargers) {
        databaseInterfaceCharger.getChargerBySerialNumber(chargerSerial, function(errorCodes, charger){
            
            if (errorCodes.length) {
                console.log(errorCodes)
            } else {
                
                console.log("Incoming connection from charger with serial #: " + chargerSerial)

                if (charger.length == 0) {
                    console.log("Charger with serial # " + chargerSerial + " was refused connection.\nReason: Charger not found in system.")
                    // TODO: Skicka error till laddaren
                    newSocket.terminate()
                } else {
                    let chargerID = charger.chargerID
                    console.log("Charger with ID: " + chargerID + " connected to the system.")
                    
                    // Save the websocket with the charger's serial in array:
                    connectedChargers.push({
                        [chargerID] : newSocket
                    })
                    messageHandler.handleMessage(newSocket, connectedChargers, chargerID)                    
                    console.log("Number of connected chargers: " + connectedChargers.length)    
                }
            }
        })
    }
    return exports
}