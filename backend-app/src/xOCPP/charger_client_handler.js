module.exports = function ({ databaseInterfaceChargers, chargerMessageHandler, v, constants, func }) {
    const c = constants.get()

    exports.handleClient = function (clientSocket, chargerSerial) {
        var messageCache = ""

        isValidClient(clientSocket, chargerSerial, function (error, connectorID) {
            if (error == null) {
                if (connectorID) {
                    console.log("Charger with ID: " + connectorID + " connected to the system.")
                    console.log("Number of connected chargers: " + v.getLengthConnectedChargerSockets() + " (" + v.getLengthChargerSerials() + ")" + " (" + v.getLengthconnectorIDs() + ")")
                    if (messageCache != "") {
                        chargerMessageHandler.handleMessage(messageCache, clientSocket, connectorID)
                    }

                } else {
                    console.log("Charger with serial # " + chargerSerial + " was refused connection.\nReason: Charger not found in system.")
                    let message = func.buildJSONMessage([c.CALL_ERROR, 1337, c.SECURITY_ERROR,
                        "Serial number was not found in database.", {}])
                    clientSocket.send(message)
                    clientSocket.terminate()
                }
            } else {
                func.getGenericError(func.getUniqueId(connectorID, c.INVALID_ID), error.toString())
            }
        })

        clientSocket.on('message', function incoming(message) {

            if (v.isInChargerSerials(chargerSerial)) {
                chargerMessageHandler.handleMessage(message, clientSocket, v.getconnectorID(chargerSerial))
            } else {
                messageCache = message
            }
        })

        clientSocket.on('close', function disconnection() {
            if (v.isInChargerSerials(chargerSerial)) {

                const connectorID = v.getconnectorID(chargerSerial)

                v.removeConnectedChargerSockets(connectorID)
                v.removeChargerSerials(chargerSerial)
                v.removeconnectorIDs(chargerSerial)
                console.log("Disconnected from charger with ID: " + connectorID)
                console.log("Number of connected chargers: " + v.getLengthConnectedChargerSockets() + " (" + v.getLengthChargerSerials() + ")" + " (" + v.getLengthconnectorIDs() + ")")
            }
        })
    }

    function isValidClient(newSocket, chargerSerial, callback) {
        if (chargerSerial == "") {
            callback(null, false)
        } else {
            databaseInterfaceChargers.getChargerBySerialNumber(chargerSerial, function (errorCodes, charger) {

                if (errorCodes.length) {
                    console.log(errorCodes)
                    callback(errorCodes[0], false)
                } else {

                    if (charger.length != 0) {
                        let connectorID = charger.connectorID

                        // Save the websocket with the charger's serial in array:
                        v.addConnectedChargerSockets(connectorID, newSocket)
                        v.addChargerSerials(chargerSerial)
                        v.addconnectorIDs(chargerSerial, connectorID)

                        callback(null, connectorID)
                    } else {
                        callback(null, false)
                    }
                }
            })
        }
    }
    return exports
}
