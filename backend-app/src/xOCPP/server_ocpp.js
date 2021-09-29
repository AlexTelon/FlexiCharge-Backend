const WebSocket = require('ws')

module.exports = function ({ clientHandler, v, databaseInterfaceCharger }) {

    exports.startServer = function () {
        console.log("Starting OCPP server")
        const wss = new WebSocket.Server({ port: 1337 })

        wss.on('connection', function connection(ws, req) {

            // Get the charger's serial number:
            let origin = req.url
            let originArray = origin.split("/")
            let chargerSerial = (originArray[originArray.length - 1]).toString()

            // Validate and handle connecting charger:
            clientHandler.handleClient(ws, chargerSerial)

            console.log("Incoming connection from charger with ID: " + chargerSerial)
            console.log("Number of connected chargers: " + connectedChargers.length)
            
            if(!validateCharger(chargerSerial)){
                ws.close();
            }

            ws.on('message', function incoming(message) {
                var request = JSON.parse(message)
                var requestType = request[2]
                
                console.log("Incoming request call: " + requestType)
    
                ws.send(JSON.stringify('[3,"call-id",{"status":"Accepted","currentTime":"2019-03-17T05:36:37.760Z","interval":60}]'))
            })

                    v.removeConnectedSockets(chargerID)
                    v.removeChargerSerials(chargerSerial)
                    v.removeChargerIDs(chargerSerial)
                    console.log("Disconnected from charger with ID: " + chargerID)
                    console.log("Number of connected chargers: " + v.getLengthConnectedSockets() + " (" + v.getLengthChargerSerials() + ")" + " (" + v.getLengthChargerIDs() + ")")
                }
            })
        })
    }
    return exports
}