module.exports = function ({ databaseInterfaceCharger, chargerMessageHandler, v, constants, func }) {
    const c = constants.get()
    
    exports.handleClient = function (clientSocket, chargerSerial) {
        var messageCache = ""

        isValidClient(clientSocket, chargerSerial, function (error, chargerID) {
            if (error == null ) {
                if (chargerID) {
                    console.log("Charger with ID: " + chargerID + " connected to the system.")
                    console.log("Number of connected chargers: " + v.getLengthConnectedChargerSockets() + " (" + v.getLengthChargerSerials() + ")" + " (" + v.getLengthChargerIDs() + ")")
                    if (messageCache != "") {
                        chargerMessageHandler.handleMessage(messageCache, clientSocket, chargerID)
                    }
    
                } else {
                    console.log("Charger with serial # " + chargerSerial + " was refused connection.\nReason: Charger not found in system.")
                    let message = func.buildJSONMessage([c.CALL_ERROR, 1337, c.SECURITY_ERROR,
                        "Serial number was not found in database.", {}])
                    clientSocket.send(message)
                    clientSocket.terminate()
                }
            } else {
                func.getGenericError(func.getUniqueId(chargerID, c.INVALID_ID), error.toString())
            }
        })

        clientSocket.on('message', function incoming(message) {

            if (v.isInChargerSerials(chargerSerial)) {
                chargerMessageHandler.handleMessage(message, clientSocket, v.getChargerID(chargerSerial))
            } else {
                messageCache = message
            }
        })

        clientSocket.on('close', function disconnection() {
            if (v.isInChargerSerials(chargerSerial)) {

                const chargerID = v.getChargerID(chargerSerial)

                v.removeConnectedChargerSockets(chargerID)
                v.removeChargerSerials(chargerSerial)
                v.removeChargerIDs(chargerSerial)
                console.log("Disconnected from charger with ID: " + chargerID)
                console.log("Number of connected chargers: " + v.getLengthConnectedChargerSockets() + " (" + v.getLengthChargerSerials() + ")" + " (" + v.getLengthChargerIDs() + ")")
            }
        })
    }

    function isValidClient(newSocket, chargerSerial, callback) {
        if (chargerSerial == "") {
            callback(null, false)
        } else {
            databaseInterfaceCharger.getChargerBySerialNumber(chargerSerial, function (errorCodes, charger) {
    
                if (errorCodes.length) {
                    console.log(errorCodes)
                    callback(errorCodes[0], false)
                } else {
    
                    if (charger.length != 0) {
                        let chargerID = charger.chargerID
    
                        // Save the websocket with the charger's serial in array:
                        v.addConnectedChargerSockets(chargerID, newSocket)
                        v.addChargerSerials(chargerSerial)
                        v.addChargerIDs(chargerSerial, chargerID)
    
                        callback(null, chargerID)
                    } else {
                        callback(null, false)
                    }
                }
            })
        }
    }
    return exports
}
