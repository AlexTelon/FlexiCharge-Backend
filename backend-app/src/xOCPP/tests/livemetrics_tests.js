const WebSocket = require('ws')
const config = require('../../config')

module.exports = function ({ chargerTests, constants, v, func, messageValidations }) {
    const c = constants.get()

    let currentTest = ""
    let testSuccessful = false
    let testValidationSuccessful = true

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
                const validationErrors = messageValidations.validateMeterValuesReq(parsedMessage)
                if(validationErrors.length){
                    testValidationSuccessful = false
                } else {
                    if(parsedMessage[2] == c.METER_VALUES && currentTest == c.METER_VALUES){
                        console.log("USER RECEIVED METER VALUES, WELL DONE!!!")
                        testSuccessful = true
                    }
                }
            })

            ws.on('close', function disconnection(){
                setTimeout(function(){
                    v.removeUserID(c.USER_ID)

                    console.log("(TEST) Number of connected user clients: " + v.getLengthConnectedUserSockets()  + ' (' + v.getUserIDsLength() + ')' + ' (' + v.getLiveMetricsTokensLength() + ')' + ' (' + v.lengthLastLiveMetricsTimestamps() + ')')
                }, 1000*config.OCPP_TEST_INTERVAL_MULTIPLIER)
            })
        } catch (error) {
            console.log(error)
        }
    }

    exports.checkUserClientsMemoryLeak = function(callback){
        if(v.getLengthConnectedUserSockets() || v.getUserIDsLength() || v.getLiveMetricsTokensLength() || v.lengthLastLiveMetricsTimestamps()){
            console.log("(MEMORY TEST FAILED) Number of connected user clients: " + v.getLengthConnectedUserSockets()  + ' (' + v.getUserIDsLength() + ')' + ' (' + v.getLiveMetricsTokensLength() + ')' + ' (' + v.lengthLastLiveMetricsTimestamps() + ')')
            callback(false, c.USER_MEMORY_LEAK)
        } else {
            callback(true, c.USER_MEMORY_LEAK)
        }
    }

    exports.testMeterValues = function (callback) {
        currentTest = c.METER_VALUES
        testSuccessful = false

        console.log('\n========= TESTING METER VALUES REQUEST... ==========\n')
        connectAsUserSocket(function(userSocket){
            chargerTests.connectAsChargerSocket(c.CHARGER_ID, function(chargerSocket){
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

                setTimeout(function(){
                    callback(chargerSocket, userSocket, testSuccessful, c.METER_VALUES)
                }, 1500*config.OCPP_TEST_INTERVAL_MULTIPLIER)
            })
        })

    }

    testIsSuccesful = function(callback){
        setTimeout(function(){
            callback(testSuccessful)
        }, 1500*config.OCPP_TEST_INTERVAL_MULTIPLIER)
    }

    return exports
}
