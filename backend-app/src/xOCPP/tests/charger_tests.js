const WebSocket = require('ws')

module.exports = function ({ ocppInterface, databaseInterfaceCharger, constants, v }) {
    const c = constants.get()  

    exports.runTests = function(){
        console.log('\n========= RUNNING TESTS ==========\n')
        const chargerId = 100001
        connectAsChargerSocket(chargerId, function(ws){
            testRemoteStart(chargerId)
            testRemoteStop(chargerId)
            testReserveNow(chargerId)
        })
        
    }
    
    connectAsChargerSocket = function (chargerId, callback) {
        try {
            console.log('\n========= CONNECTING... ==========\n')
            const ws = new WebSocket("ws://localhost:1337/charger/123abc")  

            ws.on('open', function open() {
                v.addConnectedChargerSockets(chargerId, ws)
                callback(ws)
            })

            ws.on('message', function message(data){
                parsedData = JSON.parse(data)
                console.log(parsedData)
            })
            
        } catch (error) {
            console.log(error)
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
