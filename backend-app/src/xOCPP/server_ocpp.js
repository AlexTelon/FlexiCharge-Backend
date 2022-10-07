const WebSocket = require('ws')
const config = require('../config')

module.exports = function ({ chargerClientHandler, v, constants, userClientHandler, tester }) {

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
                    break
                
                case 'charger':
                    let chargerSerial = (originArray[originArray.length - 1]).toString()
                    // Validate and handle connecting charger:
                    chargerClientHandler.handleClient(ws, chargerSerial)
                    break 
            }
        })

        if(config.RUN_OCPP_TEST){
            setTimeout(function(){
                tester.runTests(function(failedTests, successfulTests){
                    console.log('\nFAILED OCPP TESTS: ', failedTests, '\n')
                    console.log('\nSUCCESSFUL OCPP TESTS: ', successfulTests, '\n')
                })
            }, 2000); 
        }
        
        
    }
    return exports
}