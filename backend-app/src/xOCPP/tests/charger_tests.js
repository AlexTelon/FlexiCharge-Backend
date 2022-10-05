const WebSocket = require('ws')

module.exports = function ({ ocppInterface, constants, v, func }) {
    const c = constants.get()  
    
    exports.connectAsChargerSocket = function (chargerId, callback) {
        try {
            console.log('\n========= CHARGER MOCK CONNECTING... ==========\n')
            const ws = new WebSocket("ws://localhost:1337/charger/abc113")  

            ws.on('open', function open() {
                v.addConnectedChargerSockets(chargerId, ws)
                callback(ws)
            })

            ws.on('message', function message(data){
                parsedData = JSON.parse(data)
                console.log('\nCHARGER MOCK RECEIVED: \n', parsedData, '\n')

                switch(parsedData[c.MESSAGE_TYPE_INDEX]){
                    case c.CALL:
                        callSwitchForClientMock(parsedData, ws)
                        break
                    
                    case c.CALL_RESULT:
                        callResultSwitchForClientMock(parsedData, ws)
                        break
                    
                    default:
                        // Error, do nothing
                        break
                }
                
            })
            
        } catch (error) {
            console.log(error)
        }
    }

    callSwitchForClientMock = function(parsedData, ws){
        let jsonResponseMessage = ""
        let jsonRequestMessage = ""
        switch(parsedData[c.ACTION_INDEX]){
            case c.REMOTE_START_TRANSACTION:
                jsonResponseMessage = func.buildJSONMessage([ 
                    3,
                    parsedData[c.UNIQUE_ID_INDEX],
                    c.REMOTE_START_TRANSACTION,
                    { 
                        "status": c.ACCEPTED
                    } 
                ])

                ws.send(jsonResponseMessage)

                jsonRequestMessage = func.buildJSONMessage([ 
                    2,
                    parsedData[c.UNIQUE_ID_INDEX],
                    c.START_TRANSACTION,
                    { 
                        "connectorId": 1,
                        "idTag": 1,
                        "meterStart": 1,
                        "reservationId": 1,
                        "timestamp":1234512345124123
                    } 
                ])

                ws.send(jsonRequestMessage)
                break

            case c.REMOTE_STOP_TRANSACTION:
                jsonResponseMessage = func.buildJSONMessage([ 
                    3,
                    parsedData[c.UNIQUE_ID_INDEX],
                    c.REMOTE_STOP_TRANSACTION,
                    { 
                        "status": c.ACCEPTED
                    }
                ])

                ws.send(jsonResponseMessage)

                jsonRequestMessage = func.buildJSONMessage([ 
                    2,
                    parsedData[c.UNIQUE_ID_INDEX],
                    c.STOP_TRANSACTION,
                    { 
                        "connectorId": 1,
                        "idTag": 1,
                        "meterStop": 100, //TODO: this needs to be stored somewhere in db, cannot find it in db currently
                        "reservationId": 1,
                        "transactionId": 1,
                        "timestamp":1234512345124123
                
                    }
                ])

                ws.send(jsonRequestMessage)

                break

            case c.RESERVE_NOW:
                jsonResponseMessage = func.buildJSONMessage([ 
                    3,
                    parsedData[c.UNIQUE_ID_INDEX],
                    c.RESERVE_NOW,
                    { 
                        "status": c.ACCEPTED
                    } 
                ])

                ws.send(jsonResponseMessage)
                break

            case c.DATA_TRANSFER:
                jsonResponseMessage = func.buildJSONMessage([
                    3,
                    parsedData[c.UNIQUE_ID_INDEX],
                    c.DATA_TRANSFER,
                    {
                        "status": c.ACCEPTED
                    }
                ])

                ws.send(jsonResponseMessage)
                break

            default:
                console.log('Client message listener switch default case... :( (something went wrong)')
                break
        }
    }

    callResultSwitchForClientMock = function(parsedData, ws){ // ONLY NEEDED WHEN CHARGER STARTS A CONVERSATION
        switch(parsedData[c.ACTION_INDEX]){
            case c.START_TRANSACTION:
                break
            case c.BOOT_NOTIFICATION:         
                break
        }
    }

    exports.testBootNotification = function (ws) {
        console.log("\n========= TESTING BOOT NOTIFICATION... ==========\n")
        
        const jsonBootNotification = func.buildJSONMessage([ 
            2,
            "0jdsEnnyo2kpCP8FLfHlNpbvQXosR5ZNlh8v",
            c.BOOT_NOTIFICATION,
            { 
                "chargePointVendor": "AVT-Company",
                "chargePointModel": "AVT-Express",
                "chargePointSerialNumber": "avt.001.13.1",
                "chargeBoxSerialNumber": "avt.001.13.1.01",
                "firmwareVersion": "0.9.87",
                "iccid": "",
                "imsi": "",
                "meterType": "AVT NQC-ACDC",
                "meterSerialNumber": "avt.001.13.1.01" 
            } 
        ])

        ws.send(jsonBootNotification)
    }
    
    exports.testRemoteStart = function (chargerID) {
        console.log("\n========= TESTING REMOTE START... ==========\n")
        ocppInterface.remoteStartTransaction(chargerID, 1, function (error, response) {
            if (error != null) {
                console.log("\nError: "+error)
            } else {
                console.log("\nTest result response: " + response.status+", timestamp: "+response.timestamp+", meterStart: "+response.meterStart)
            }
        })
    }

    exports.testRemoteStop = function (chargerID) {
        console.log("\n========= TESTING REMOTE STOP... ==========\n")
        ocppInterface.remoteStopTransaction(chargerID, 1, function (error, response) {
            if (error != null) {
                console.log("\nError: "+error)
            } else {
                console.log("\nTest result response: " + response.status+", timestamp: "+response.timestamp +", meterStop: "+response.meterStop)
            }
        })
    }

    exports.testReserveNow = function (chargerID) {
        console.log("\n========= TESTING RESERVE NOW... ==========\n")
        ocppInterface.reserveNow(chargerID, c.CONNECTOR_ID, c.ID_TAG, c.RESERVATION_ID, c.PARENT_ID_TAG, function (error, response) {
            if (error != null) {
                console.log("\nError updating charger status in DB: " + error)
            } else {
                console.log("\nTest result response: " + response)
            }
        })
    }

    return exports
}
