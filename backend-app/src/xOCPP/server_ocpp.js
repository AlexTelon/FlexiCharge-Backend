const WebSocket = require('ws')




const connectedChargers = []

module.exports = function({databaseInterfaceCharger}) {

    exports.startServer = function() {
        console.log("Starting OCPP server")
        const wss = new WebSocket.Server({ port: 1337 })

        function validateCharger(chargerId){
            if(chargerId.length == 6){
                if(chargerId.match(/^[0-9]+$/) != null){
                    return true
                }else{
                    return false
                }
            }else{
                return false
            }
        }
    
        wss.on('connection', function connection(ws, req) {
            
            // Get the charger's serial number:
            let origin = req.url
            let originArray = origin.split("/")
            let chargerSerial = originArray[originArray.length - 1]

            // If connected charger does not pass validation, close connection
            if(!validateCharger(chargerSerial)){
                ws.close()
                console.log("Refused connection from charger '" + chargerSerial + "'. Reason: invalid serial #.")
            }
            
            // Else, save the websocket with the charger's serial in array:
            connectedChargers.push({
                chargerSerial : ws
            })
            
            // Log to console
            console.log("Incoming connection from charger with ID: " + chargerSerial)
            console.log("Number of connected chargers: " + connectedChargers.length)
            
            // Check if charger exists in database:
            databaseInterfaceCharger.getCharger(chargerSerial, function(errorCodes, charger){
                if (errorCodes.length) {
                    console.log(errorCodes)
                } else {
                    if (charger == null) {
                        console.log("Charger does not exist in database.")
                    } else {
                        console.log("Charger is known since before.")
                    }
                }
            })

            ws.on('message', function incoming(message) {
                var request = JSON.parse(message)
                var requestType = request[2]
                
                console.log("Incoming request call: " + requestType)
    
                ws.send(JSON.stringify('[3,"call-id",{"status":"Accepted","currentTime":"2019-03-17T05:36:37.760Z","interval":60}]'))
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