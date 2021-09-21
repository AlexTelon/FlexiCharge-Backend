const WebSocket = require('ws')




const connectedChargers = []

function handleMessage(clientSocket) {
    
    clientSocket.on('message', function incoming(message) {
        var request = JSON.parse(message)
        var requestType = request[2]
        
        console.log("Incoming request call: " + requestType)

        clientSocket.send(JSON.stringify('[3,"call-id",{"status":"Accepted","currentTime":"2019-03-17T05:36:37.760Z","interval":60}]'))
    })

}

module.exports = function({databaseInterfaceCharger}) {

    exports.startServer = function() {
        console.log("Starting OCPP server")
        const wss = new WebSocket.Server({ port: 1337 })
    
        wss.on('connection', function connection(ws, req) {
            
            // Get the charger's serial number:
            let origin = req.url
            let originArray = origin.split("/")
            let chargerSerial = originArray[originArray.length - 1]

            if (connectedChargers.includes(chargerSerial)) {
                handleMessage(ws)
            } 
            
            // Check if charger exists in database:
            databaseInterfaceCharger.getChargerByChargePointId(chargerSerial, function(errorCodes, charger){
                if (errorCodes.length) {
                    console.log(errorCodes)
                } else {
                    if (charger == null) {
                        console.log("Charger with Charge Point ID " + chargerSerial + " was refused connection. Reason: Not found in system.")
                        ws.close
                        // Släck anslutning och skicka till laddaren
                    } else {
                        console.log("Charger qwith ID: " + charger.chargerID + " connected to the system.")
                        
                        // Else, save the websocket with the charger's serial in array:
                        connectedChargers.push({
                            chargePointId : ws
                        })
                        
                        // Log to console
                        console.log("Incoming connection from charger with ID: " + chargerSerial)
                        console.log("Number of connected chargers: " + connectedChargers.length)

                        handleMessage(ws)
                        // Skicka "success" med charger ID etc. till laddaren
                    }
                }
            })

            ws.on('close', function disconnection(){
                connectedChargers.splice(ws)
                console.log("Disconnected connection from charger with ID: " + chargerSerial)
                console.log("Number of connected chargers:" + connectedChargers.length)
            })
        })
    }

    return exports
}