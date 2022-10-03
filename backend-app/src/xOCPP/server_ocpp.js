const WebSocket = require('ws')
const config = require('../config')

module.exports = function ({ chargerClientHandler, v, databaseInterfaceCharger, test }) {

    exports.startServer = function () {
        console.log("Starting OCPP server")
        const wss = new WebSocket.Server({ port: 1337 })
        
        wss.on('connection', function connection(ws, req) {

            // Get the charger's serial number:
            let origin = req.url
            let originArray = origin.split("/")
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
        })

        
        if(config.RUN_OCPP_TEST){
            setTimeout(function(){
                test.runTests()
            }, 2000);
        }
        
        
    }
    return exports
}