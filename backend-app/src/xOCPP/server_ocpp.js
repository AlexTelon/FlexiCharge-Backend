const WebSocket = require('ws')

module.exports = function ({ chargerClientHandler, v, databaseInterfaceCharger }) {

    exports.startServer = function () {
        console.log("Starting OCPP server")
        const wss = new WebSocket.Server({ port: 1337 })

        wss.on('connection', function connection(ws, req) {

            // Get the charger's serial number:
            let origin = req.url
            let originArray = origin.split("/")
            const clientType = originArray[1]
            
            switch(clientType){
                case 'app':
                    const appID = originArray[originArray.length - 1]

                    ws.on('close', function disconnection() {
                    
                    })
                    break

                case 'charger':
                    let chargerSerial = (originArray[originArray.length - 1]).toString()
                    // Validate and handle connecting charger:
                    chargerClientHandler.handleClient(ws, chargerSerial)

                    ws.on('close', function disconnection() {
                        if (v.isInChargerSerials(chargerSerial)) {

                            const chargerID = v.getChargerID(chargerSerial)

                            v.removeConnectedSockets(chargerID)
                            v.removeChargerSerials(chargerSerial)
                            v.removeChargerIDs(chargerSerial)
                            console.log("Disconnected from charger with ID: " + chargerID)
                            console.log("Number of connected chargers: " + v.getLengthConnectedSockets() + " (" + v.getLengthChargerSerials() + ")" + " (" + v.getLengthChargerIDs() + ")")
                        }
                    })
                    break
            }

            
        })
    }
    return exports
}