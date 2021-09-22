module.exports = function({databaseInterfaceCharger, constants}) {

    exports.isValidClient = function(newSocket, chargerSerial, callback) {
        databaseInterfaceCharger.getChargerBySerialNumber(chargerSerial, function(errorCodes, charger){
            
            if (errorCodes.length) {
                console.log(errorCodes)
            } else {
                
                console.log("Incoming connection from charger with serial #: " + chargerSerial)

                if (charger.length != 0) {
                    let chargerID = charger.chargerID
                    console.log("Charger with ID: " + chargerID + " connected to the system.")
                    
                    // Save the websocket with the charger's serial in array:
                    connectedChargers.push({
                        [chargerID]: newSocket
                    })
                    console.log("Number of connected chargers: " + connectedChargers.length)
                    
                    callback(chargerID)
                } else {
                    callback(false)
                }
            }
        })                  
    }
    return exports
}