module.exports = function ({ chargerTests, liveMetricsTests, constants }) {
    const c = constants.get()
    let errors = []

    runLiveMetricsTests = function(callback){ /** PLEASE NOTE THAT THIS ONLY WORKS WITH LOCAL DATABASE AND THE CORRECT TEST DATA IN THE LOCAL DATABASE */
        console.log('\n========= RUNNING TESTS FOR LIVE METRICS ==========\n')
        liveMetricsTests.testMeterValues(function(chargerSocket, userSocket, error){
            setTimeout(function(){
                //Disconnect user- and charger sockets
                userSocket.terminate()
                chargerSocket.terminate()

                setTimeout(function(){
                    liveMetricsTests.checkUserClientsMemoryLeak(function(userMemoryError){
                        handleError(userMemoryError)
                    })
                    
                    chargerTests.checkChargerClientsMemoryLeak(function(chargerMemoryError){
                        handleError(chargerMemoryError)
                    })
                }, 500)

                callback()
            }, 2000)

            handleError(error)
        })
        
    }

    runChargerTests = function(callback){ /** PLEASE NOTE THAT THIS ONLY WORKS WITH LOCAL DATABASE AND THE CORRECT TEST DATA IN THE LOCAL DATABASE */
        console.log('\n========= RUNNING TESTS FOR CHARGER ==========\n')
        chargerTests.connectAsChargerSocket(c.CHARGER_ID, function(ws){
            
                chargerTests.testBootNotification(ws, function(bootError){
                    handleError(bootError)
    
                    chargerTests.testRemoteStart(c.CHARGER_ID, function(startError){
                        handleError(startError)
    
                        chargerTests.testRemoteStop(c.CHARGER_ID, function(stopError){
                            handleError(stopError)
    
                            chargerTests.testReserveNow(c.CHARGER_ID, function(reserveError){
                                handleError(reserveError)
                                ws.terminate() 
    
                                chargerTests.checkChargerClientsMemoryLeak(function(memoryError){
                                    setTimeout(function(){
                                        handleError(memoryError)
                                        callback(errors)
                                    }, 500)
                                }) 

                            })
                        })
                    })
                })   
        })
    }

    exports.runTests = function(callback){
        runChargerTests(function(){
            runLiveMetricsTests(function(){
                callback(errors)
            })
        })
    }

    handleError = function(error){
        if(error) {
            errors.push(error) 
        }
    }

    return exports
}