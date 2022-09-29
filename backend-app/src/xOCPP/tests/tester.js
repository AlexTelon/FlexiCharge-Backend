const CHARGERID = 100001

module.exports = function ({ chargerTests, liveMetricsTests, constants, v, func }) {
    const c = constants.get()

    exports.runLiveMetricsTests = function(){ /** PLEASE NOTE THAT THIS ONLY WORKS WITH LOCAL DATABASE AND THE CORRECT TEST DATA IN THE LOCAL DATABASE */
        console.log('\n========= RUNNING TESTS ==========\n')
        liveMetricsTests.testMeterValues()
    }

    exports.runTests = function(){ /** PLEASE NOTE THAT THIS ONLY WORKS WITH LOCAL DATABASE AND THE CORRECT TEST DATA IN THE LOCAL DATABASE */
        console.log('\n========= RUNNING TESTS ==========\n')
        chargerTests.connectAsChargerSocket(CHARGERID, function(ws){
            setTimeout(function(){
                chargerTests.testBootNotification(ws)
            }, 2000)
            
            setTimeout(function(){
                chargerTests.testRemoteStart(CHARGERID)
            }, 4000)
            
            setTimeout(function(){
                chargerTests.testRemoteStop(CHARGERID)
            }, 6000)
            
            setTimeout(function(){
                chargerTests.testReserveNow(CHARGERID)
            }, 8000)
        })
    }
    return exports
}