const WebSocket = require('ws')
const PubSub = require('pubsub-js')

module.exports = function ({ chargerTests, constants, v, func }) {
    const c = constants.get()

    connectAsUserSocket = function (callback) {
        try {
            console.log('\n========= USER CLIENT MOCK CONNECTING... ==========\n')
            const ws = new WebSocket("ws://localhost:1337/user/" + c.USER_ID)  
    
            ws.on('open', function open() {
                v.addUserIDWIthTransactionID(c.USER_ID, c.TRANSACTION_ID)
                callback(ws)
            })

            ws.on('message', function(message){
                parsedMessage = JSON.parse(message)
                console.log('USER CLIENT MOCK RECEIVED: ', parsedMessage)

                if(parsedMessage[2] == c.METER_VALUES){
                    console.log("USER RECEIVED METER VALUES, WELL DONE!!!")
                } else {
                    //TODO: Implement
                }
                    
            })

            ws.on('close', function disconnection(){
                setTimeout(function(){
                    v.removeUserID(c.USER_ID)
                    console.log("(TEST) Number of connected user clients: " + v.getLengthConnectedUserSockets()  + ' (' + v.getUserIDsLength() + ')' + ' (' + v.getLiveMetricsTokensLength() + ')' + ' (' + v.lengthLastLiveMetricsTimestamps() + ')')
                }, 1000)
            })
            
        } catch (error) {
            console.log(error)
        }
    }

    exports.testMeterValues = function (callback) {
        console.log('\n========= TESTING METER VALUES REQUEST... ==========\n')
        connectAsUserSocket(function(userSocket){
            chargerTests.connectAsChargerSocket(c.CHARGER_ID, function(chargerSocket){ //TODO: IS THIS A SERVER SOCKET OR CHARGER SOCKET???
                meterValues = func.buildJSONMessage([ 
                    2, 
                    "100001RemoteStartTransaction1664455481548",
                    "MeterValues",
                    {
                        "connectorId": 1,
                        "transactionId": 1,
                        "timestamp": 1664881780904,
                        "values": {
                            "chargingPercent": {
                                "value": 0,
                                "unit": "%",
                                "measurand": "SoC"
                            },
                            "chargingPower": {
                                "value": 0,
                                "unit": "W",
                                "measurand": "Power.Active.Import"
                            },
                            "chargedSoFar": {
                                "value": 0,
                                "unit": "Wh",
                                "measurand": "Energy.Active.Import.Interval"
                            }
                        }
                    }
                ])

                chargerSocket.send(meterValues)
                callback(chargerSocket, userSocket)
            })
        })
    }

    return exports
}