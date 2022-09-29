const WebSocket = require('ws')
const config = require('../config')

module.exports = function ({ chargerClientHandler, v, userClientHandler, tester }) {

    exports.startServer = function () {
        console.log("Starting OCPP server")
        const wss = new WebSocket.Server({ port: 1337 })
        
        wss.on('connection', function connection(ws, req) {

            // Get the charger's serial number:
            let origin = req.url
            let originArray = origin.split("/")
            let clientType = originArray[1]
            
            
            switch(clientType){
                //ws://123.123.123:1337/user/abc123-123-123
                case 'user':
                    const userID = originArray[originArray.length - 1].toString()
                    console.log('UserID trying to connect: ', userID)

                    userClientHandler.handleClient(ws, userID)

                    ws.on('close', function disconnection() {
                        v.removeConnectedUserSocket(userID)

                        if(v.isInUserIDs(userID)){
                            v.removeUserID(userID)
                        }

                        console.log("Disconnected from client with ID: " + userID)
                        console.log("Number of connected clients: " + v.getLengthConnectedUserSockets())
                    })
                    break
                
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
                    break 
            }
        })

        if(config.RUN_OCPP_TEST){
            // // setTimeout(function(){
            // //     tester.runTests()
            // // }, 2000);

            setTimeout(function(){
                tester.runLiveMetricsTests()
            }, 2000);
        }
        
        
    }
    return exports
}