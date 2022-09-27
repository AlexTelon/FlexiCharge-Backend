const WebSocket = require('ws')

module.exports = function ({ ocppInterface, constants, v, func }) {
    const c = constants.get()  

    exports.runTests = function(){
        console.log('\n========= RUNNING TESTS ==========\n')
        const chargerId = 100001
        connectAsChargerSocket(chargerId, function(ws){
            setTimeout(function(){
                testRemoteStart(chargerId)

                setTimeout(function(){
                    testRemoteStop(chargerId)
                }, 2000);
                
                setTimeout(function(){
                    testReserveNow(chargerId)
                }, 4000);

                setTimeout(function(){
                    ws.terminate()
                }, 6000);
            }, 2000);
            
        })
        
    }
    
    connectAsChargerSocket = function (chargerId, callback) {
        try {
            console.log('\n========= MOCK CLIENT CONNECTING... ==========\n')
            const ws = new WebSocket("ws://localhost:1337/charger/123abc")  

            ws.on('open', function open() {
                v.addConnectedChargerSockets(chargerId, ws)
                callback(ws)
            })

            ws.on('message', function message(data){
                parsedData = JSON.parse(data)
                console.log(parsedData)

                switch(parsedData[c.MESSAGE_TYPE_INDEX]){
                    case c.CALL:
                        callSwitchForClientMock(parsedData, ws)
                        break
                    
                    case c.CALL_RESULT:
                        callResultSwitchForClientMock(parsedData, ws)
                        break
                }
                
            })
            
        } catch (error) {
            console.log(error)
        }
    }

    callSwitchForClientMock = function(parsedData, ws){
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
                
                break

            case c.RESERVE_NOW:
                break

            default:
                console.log('Client message listener switch default case...')
                break
        }
    }

    callResultSwitchForClientMock = function(parsedData, ws){
        switch(parsedData[c.ACTION_INDEX]){
            case c.START_TRANSACTION:
                console.log('Server responded with: ' + parsedData)
        }
    }

    //test 2
    testRemoteStart = function (chargerID) {
        console.log("\n========= TESTING REMOTE START... ==========\n")
        ocppInterface.remoteStartTransaction(chargerID, 1, function (error, response) {
            if (error != null) {
                console.log("\nError: "+error)
            } else {
                console.log("\nTest result response: " + response.status+", timestamp: "+response.timestamp+", meterStart: "+response.meterStart)
            }
        })
    }

    //test 3
    testRemoteStop = function (chargerID) {

        console.log("\n========= TESTING REMOTE STOP... ==========\n")
        ocppInterface.remoteStopTransaction(chargerID, 57, function (error, response) {
            if (error != null) {
                console.log("\nError: "+error)
            } else {
                console.log("\nTest result response: " + response.status+", timestamp: "+response.timestamp, +", meterStop: "+response.meterStop)
            }
        })
    }

    // test 4
    testReserveNow = function (chargerID) {

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