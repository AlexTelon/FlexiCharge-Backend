const WebSocket = require('ws')
const config = require('../../config')


module.exports = function ({ ocppInterface, constants, v, func, messageValidations }) {
    const c = constants.get()  

    let currentTest = ""
    let testSuccessful = false
    let testValidationSuccessful = true
    
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
                        testSuccessful = false
                        break
                }    
            })
            
        } catch (error) {
            console.log(error)
        }
    }

    callSwitchForClientMock = function(parsedData, ws){
        let validationErrors = []
        let jsonResponseMessage = ""
        let jsonRequestMessage = ""
        switch(parsedData[c.ACTION_INDEX]){
            case c.REMOTE_START_TRANSACTION:

                validationErrors = messageValidations.validateRemoteStartTransactionReq(parsedData)
                if(validationErrors.length){
                    testValidationSuccessful = false
                }

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

                validationErrors = messageValidations.validateRemoteStopTransactionReq(parsedData)
                if(validationErrors.length){
                    testValidationSuccessful = false
                }

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
                validationErrors = messageValidations.validateReserveNowReq(parsedData)
                if(validationErrors.length){
                    testValidationSuccessful = false
                }

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

                validationErrors = messageValidations.validateDataTransferReq(parsedData)
                if(validationErrors.length){
                    testValidationSuccessful = false
                }

                if(currentTest == c.BOOT_NOTIFICATION && testValidationSuccessful){
                    testSuccessful = true
                }
                
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

    callResultSwitchForClientMock = function(parsedData, ws){
        switch(parsedData[c.ACTION_INDEX]){
            case c.START_TRANSACTION:
                if(currentTest == c.REMOTE_START_TRANSACTION && testValidationSuccessful){
                    testSuccessful = true
                }
                
                break
            case c.BOOT_NOTIFICATION:
                validationErrors = messageValidations.validateBootNotificationConf(parsedData)
                if(validationErrors.length){
                    testValidationSuccessful = false
                }
                break

            case c.STOP_TRANSACTION:
                if(currentTest == c.REMOTE_STOP_TRANSACTION && testValidationSuccessful){
                    testSuccessful = true
                }
                break
            case c.METER_VALUES:
                validationErrors = messageValidations.validateMeterValuesConf(parsedData)
                if(validationErrors.length){
                    testValidationSuccessful = false //THIS WILL NOT FAIL THE TEST, BECAUSE THE TEST IS IN livemetrics_tests.js FILE!!! <3
                }
                break
        }
    }

    exports.checkChargerClientsMemoryLeak = function(origin, callback){
        if(v.getLengthConnectedChargerSockets() || v.getLengthChargerSerials() || v.getLengthChargerIDs()){
            console.log("(MEMORY TEST FAILED) Number of connected chargers: " + v.getLengthConnectedChargerSockets() + " (" + v.getLengthChargerSerials() + ")" + " (" + v.getLengthChargerIDs() + ")")
            callback(false, c.CHARGER_MEMORY_LEAK + " : " + origin)
        } else {
            callback(true, c.CHARGER_MEMORY_LEAK + " : " + origin)
        }
    }

    exports.testBootNotification = function (ws, callback) {
        currentTest = c.BOOT_NOTIFICATION
        testSuccessful = false
        testValidationSuccessful = true

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

        setTimeout(function(){
            callback(testSuccessful, c.BOOT_NOTIFICATION)
        }, 1500*config.OCPP_TEST_INTERVAL_MULTIPLIER)
    }
    
    exports.testRemoteStart = function (chargerID, callback) {
        currentTest = c.REMOTE_START_TRANSACTION
        testSuccessful = false
        testValidationSuccessful = true

        console.log("\n========= TESTING REMOTE START... ==========\n")
        ocppInterface.remoteStartTransaction(chargerID, 1, function (error, response) {
            if (error != null) {
                console.log("\nError: "+ error)
            } else {
                console.log("\nTest result response: " + response.status+", timestamp: "+response.timestamp+", meterStart: "+response.meterStart)
            }
        })

        setTimeout(function(){
            callback(testSuccessful, c.REMOTE_START_TRANSACTION)
        }, 1500*config.OCPP_TEST_INTERVAL_MULTIPLIER)
    }

    exports.testRemoteStop = function (chargerID, callback) {
        currentTest = c.REMOTE_STOP_TRANSACTION
        testSuccessful = false
        testValidationSuccessful = true

        console.log("\n========= TESTING REMOTE STOP... ==========\n")
        ocppInterface.remoteStopTransaction(chargerID, 1, function (error, response) {
            if (error != null) {
                console.log("\nError: "+error)
            } else {
                console.log("\nTest result response: " + response.status+", timestamp: "+response.timestamp +", meterStop: "+response.meterStop)
            }
        })

        setTimeout(function(){
            callback(testSuccessful, c.REMOTE_STOP_TRANSACTION)
        }, 1500*config.OCPP_TEST_INTERVAL_MULTIPLIER)

    }

    exports.testReserveNow = function (chargerID, callback) {
        currentTest = c.RESERVE_NOW
        testSuccessful = false
        testValidationSuccessful = true

        console.log("\n========= TESTING RESERVE NOW... ==========\n")
        ocppInterface.reserveNow(chargerID, c.CONNECTOR_ID, c.ID_TAG, c.RESERVATION_ID, c.PARENT_ID_TAG, function (error, response) {
            if (error != null) {
                console.log("\nError updating charger status in DB: " + error)
            } else {
                console.log("\nTest result response: " + response)
                if(currentTest == c.RESERVE_NOW && response == c.ACCEPTED && testValidationSuccessful){
                    testSuccessful = true
                }
            }
        })

        setTimeout(function(){
            callback(testSuccessful, c.RESERVE_NOW)
        }, 1500*config.OCPP_TEST_INTERVAL_MULTIPLIER)

    }

    testIsSuccesful = function(callback){
        setTimeout(function(){
            callback(testSuccessful)
        }, 1500*config.OCPP_TEST_INTERVAL_MULTIPLIER)
    }

    return exports
}
