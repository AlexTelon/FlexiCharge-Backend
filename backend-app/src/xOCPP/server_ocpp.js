const WebSocket = require('ws')

module.exports = function ({ chargerClientHandler, v, databaseInterfaceCharger, appClientHandler }) {

    exports.startServer = function () {
        console.log("Starting OCPP server")
        const wss = new WebSocket.Server({ port: 1337 })

        wss.on('connection', function connection(ws, req) {

            // Get the charger's serial number:
            let origin = req.url
            let originArray = origin.split("/")
            let clientType = originArray[1]
            
            switch(clientType){
                case 'app':
                    const transactionID = Number.parseInt(originArray[originArray.length - 1]) //Currently for example '1a' becomes 1 and 'a' or 'a1' becomes NaN
                    console.log(transactionID)

                    if(!Number.isInteger(transactionID)){
                        ws.terminate()
                        return
                    }

                    appClientHandler.handleClient(ws, transactionID)

                    ws.on('close', function disconnection() {
                        if(v.isInAppTransactionIDs(transactionID)){
                            v.removeConnectedAppSockets(transactionID)
                            v.removeAppTransactionID(transactionID)
                        }
                    })

                    break;

                case 'charger':
                    let chargerSerial = (originArray[originArray.length - 1]).toString()
                    // Validate and handle connecting charger:
                    chargerClientHandler.handleClient(ws, chargerSerial)

                    ws.on('close', function disconnection() {
                        if (v.isInChargerSerials(chargerSerial)) {

                            const chargerID = v.getChargerID(chargerSerial)

                            v.removeConnectedChargerSockets(chargerID)
                            v.removeChargerSerials(chargerSerial)
                            v.removeChargerIDs(chargerSerial)
                            console.log("Disconnected from charger with ID: " + chargerID)
                            console.log("Number of connected chargers: " + v.getLengthConnectedChargerSockets() + " (" + v.getLengthChargerSerials() + ")" + " (" + v.getLengthChargerIDs() + ")")
                        }
                    })
                    break;
                
                default:
                    ws.terminate()
                    break;
            }

            
        })
    }
    return exports
}