const { callbackify } = require("util")


module.exports = function ({ chargerTests, liveMetricsTests, constants, v, func }) {
    const c = constants.get()

    runLiveMetricsTests = function(){ /** PLEASE NOTE THAT THIS ONLY WORKS WITH LOCAL DATABASE AND THE CORRECT TEST DATA IN THE LOCAL DATABASE */
        console.log('\n========= RUNNING TESTS FOR LIVE METRICS ==========\n')
        liveMetricsTests.testMeterValues(function(chargerSocket, userSocket){
            setTimeout(function(){
                //Disconnect user- and charger sockets
                userSocket.terminate()
                chargerSocket.terminate()
            }, 2000)
        })
    }

    runChargerTests = function(callback){ /** PLEASE NOTE THAT THIS ONLY WORKS WITH LOCAL DATABASE AND THE CORRECT TEST DATA IN THE LOCAL DATABASE */
        console.log('\n========= RUNNING TESTS FOR CHARGER ==========\n')
        chargerTests.connectAsChargerSocket(c.CHARGER_ID, function(ws){
            setTimeout(function(){
                chargerTests.testBootNotification(ws)
            }, 2000)
            
            setTimeout(function(){
                chargerTests.testRemoteStart(c.CHARGER_ID)
            }, 4000)
            
            setTimeout(function(){
                chargerTests.testRemoteStop(c.CHARGER_ID)
            }, 6000)
            
            setTimeout(function(){
                chargerTests.testReserveNow(c.CHARGER_ID)
            }, 8000)

            setTimeout(function(){
                ws.terminate()
            }, 10000)

            setTimeout(function(){
                callback()
            }, 11000)
        })
    }

    exports.runTests = function(){
        runChargerTests(function(){
            runLiveMetricsTests()
        })
    }

    return exports
}