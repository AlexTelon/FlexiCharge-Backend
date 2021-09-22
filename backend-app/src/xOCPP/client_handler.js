module.exports = function ({ databaseInterfaceCharger, constants, messageHandler, variables }) {

    exports.handelClient = function (clientSocket, chargerSerial) {

        var messageChache = ""

        isValidClient(clientSocket, chargerSerial, function (chargerID) {
            if (chargerID) {
                console.log("Charger with ID: " + chargerID + " connected to the system.")
                console.log("Number of connected chargers: " + variables.getLengthConnectedCharges() + " (" + variables.getLengthChargerSerials() + ")")
                if (messageChache != "") {
                    messageHandler.handleMessage(messageChache, clientSocket, chargerID)
                }

            } else {
                console.log("Charger with serial # " + chargerSerial + " was refused connection.\nReason: Charger not found in system.")
                clientSocket.terminate()
            }
        })

        clientSocket.on('message', function incoming(message) {

            if (variables.isInChargerSerials(chargerSerial)) {

                messageHandler.handleMessage(message, clientSocket, null)

            } else {
                messageChache = message
            }
        })
    }

    function isValidClient(newSocket, chargerSerial, callback) {
        databaseInterfaceCharger.getChargerBySerialNumber(chargerSerial, function (errorCodes, charger) {

            if (errorCodes.length) {
                console.log(errorCodes)
            } else {

                if (charger.length != 0) {
                    let chargerID = charger.chargerID
                    
                    // Save the websocket with the charger's serial in array:
                    variables.addConnectedChargers(chargerID, newSocket)
            
                    variables.addChargerSerials(chargerSerial)
                    //console.log("Number of connected chargers: " + connectedChargers.length)

                    callback(chargerID)
                } else {
                    callback(false)
                }
            }
        })
    }
    return exports
}