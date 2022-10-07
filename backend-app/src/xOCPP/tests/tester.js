module.exports = function ({ chargerTests, liveMetricsTests, constants }) {
    const c = constants.get()
    let failedTests = []
    let successfulTests = []

    runLiveMetricsTests = function(callback){ /** PLEASE NOTE THAT THIS ONLY WORKS WITH LOCAL DATABASE AND THE CORRECT TEST DATA IN THE LOCAL DATABASE */
        console.log('\n========= RUNNING TESTS FOR LIVE METRICS ==========\n')
        liveMetricsTests.testMeterValues(function(chargerSocket, userSocket, meterValuesSucceeded, meterValues){
            setTimeout(function(){
                //Disconnect user- and charger sockets
                userSocket.terminate()
                chargerSocket.terminate()

                setTimeout(function(){
                    liveMetricsTests.checkUserClientsMemoryLeak(function(userMemorySucceeded, userMemory){
                        handleError(userMemorySucceeded, userMemory)
                    })
                    
                    chargerTests.checkChargerClientsMemoryLeak(function(chargerMemorySucceeded, chargerMemory){
                        handleError(chargerMemorySucceeded, chargerMemory)
                    })

                    setTimeout(function(){
                        callback()
                    }, 1000)
                }, 2000)
            }, 2000)

            handleError(meterValuesSucceeded, meterValues)
        })
        
    }

    runChargerTests = function(callback){ /** PLEASE NOTE THAT THIS ONLY WORKS WITH LOCAL DATABASE AND THE CORRECT TEST DATA IN THE LOCAL DATABASE */
        console.log('\n========= RUNNING TESTS FOR CHARGER ==========\n')
        chargerTests.connectAsChargerSocket(c.CHARGER_ID, function(ws){
            
                chargerTests.testBootNotification(ws, function(bootSucceeded, bootNotification){
                    handleError(bootSucceeded, bootNotification)
    
                    chargerTests.testRemoteStart(c.CHARGER_ID, function(startSucceeded, remoteStart){
                        handleError(startSucceeded, remoteStart)
    
                        chargerTests.testRemoteStop(c.CHARGER_ID, function(stopSucceeded, remoteStop){
                            handleError(stopSucceeded, remoteStop)
    
                            chargerTests.testReserveNow(c.CHARGER_ID, function(reserveSucceeded, reserveNow){
                                handleError(reserveSucceeded, reserveNow)
                                ws.terminate() 
                                
                                setTimeout(function(){
                                    chargerTests.checkChargerClientsMemoryLeak(function(chargerMemorySucceeded, chargerMemory){
                                        setTimeout(function(){
                                            handleError(chargerMemorySucceeded, chargerMemory)
                                            callback(failedTests, successfulTests)
                                        }, 500)
                                    }) 
                                }, 2000)

                            })
                        })
                    })
                })   
        })
    }

    exports.runTests = function(callback){
        runChargerTests(function(){
            runLiveMetricsTests(function(){
                callback(failedTests, successfulTests)
            })
        })
    }

    handleError = function(testSucceeded, test){
        if(testSucceeded) {
            successfulTests.push(test)
        } else {
            failedTests.push(test) 
        }
    }

    return exports
}