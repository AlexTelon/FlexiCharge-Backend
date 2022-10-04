const { Socket } = require("dgram")
const { stringify } = require("querystring")
const { buildJSONMessage } = require("./global_functions")

module.exports = function ({ func, v, constants, interfaceHandler, databaseInterfaceCharger, databaseInterfaceChargePoint, databaseInterfaceTransactions }) {
    const c = constants.get()

    exports.handleMessage = function (message, clientSocket, chargerID) {
        try {

            let data = JSON.parse(message)
            let messageTypeID = data[c.MESSAGE_TYPE_INDEX]
            let uniqueID = data[c.UNIQUE_ID_INDEX]

            var response = ""

            switch (messageTypeID) {
                case c.CALL:

                    response = callSwitch(uniqueID, data, chargerID)
                    break

                case c.CALL_RESULT:

                    callResultSwitch(uniqueID, data, chargerID)
                    break

                case c.CALL_ERROR:

                    response = callErrorSwitch(uniqueID, data)
                    break

                default:

                    response = func.getGenericError(uniqueID, "MessageTypeID is invalid")
                    break
            }
            if (response != "") {
                clientSocket.send(response)
            }
        } catch (error) {
            console.log(error)
            clientSocket.send(func.getGenericError(c.INTERNAL_ERROR, error.toString()))
        }

    }


    function callSwitch(uniqueID, request, chargerID) {

        let action = request[c.ACTION_INDEX]
        console.log("Incoming request call: " + action)
        let callResult = ""

        switch (action) {
            case c.BOOT_NOTIFICATION:
                sendBootNotificationResponse(chargerID, uniqueID, c.ACCEPTED)
                sendBootData(chargerID)
                break

            case c.STATUS_NOTIFICATION:
                sendStatusNotificationResponse(chargerID, uniqueID, request)
                break
            case c.DATA_TRANSFER:
                handleDataTransfer(chargerID, uniqueID, request)
                break

            case c.START_TRANSACTION:
                handleStartTrasaction(chargerID, uniqueID, request)
                break

            case c.STOP_TRANSACTION:
                handleStopTransaction(chargerID, uniqueID, request)
                break

            default:
                callResult = func.getCallResultNotImplemeted(uniqueID, action)
                break
        }

        return callResult
    }

    function handleStopTransaction(chargerID, uniqueID, request) {

        let callback = v.getCallback(chargerID)
        v.removeCallback(chargerID)
        socket = v.getConnectedChargerSocket(chargerID)

        if (callback != null && socket != null) {

            databaseInterfaceCharger.updateChargerStatus(chargerID, c.AVAILABLE, function (error, charger) {
                if (error.length > 0) {
                    console.log("\nError updating charger status in DB: " + error)
                    callback(c.INTERNAL_ERROR, null)
                    socket.send(func.getGenericError(uniqueID, error.toString()))
                } else {
                    console.log("\nCharger updated in DB: " + charger.status)
                    payload = request[c.PAYLOAD_INDEX]
                    callback(null, { status: c.ACCEPTED, timestamp: payload.timestamp, meterStop: payload.meterStop })

                    socket.send(func.buildJSONMessage([c.CALL_RESULT, uniqueID, c.STOP_TRANSACTION,
                    // as we have no accounts idTagInfo is 1 as standard
                    { idTagInfo: 1 }]))
                }
            })


        } else {
            console.log("getStartTransactionResponse -> No callback tied to this chargerID OR invalid chargerID")

            if (socket != null) {
                socket.send(func.getGenericError(uniqueID, c.NO_ACTIVE_TRANSACTION))
            }
        }
    }

    function handleStartTrasaction(chargerID, uniqueID, request) {

        let callback = v.getCallback(chargerID)
        v.removeCallback(chargerID)
        socket = v.getConnectedChargerSocket(chargerID)

        if (callback != null && socket != null) {

            databaseInterfaceCharger.updateChargerStatus(chargerID, c.CHARGING, function (error, charger) {
                if (error.length > 0) {
                    console.log("\nError updating charger status in DB: " + error)
                    callback(c.INTERNAL_ERROR, null)
                    socket.send(func.getGenericError(uniqueID, error.toString()))
                } else {
                    console.log("\nCharger updated in DB: " + charger.status)
                    payload = request[c.PAYLOAD_INDEX]
                    callback(null, { status: c.ACCEPTED, timestamp: payload.timestamp, meterStart: payload.meterStart })

                    transactionID = v.getTransactionID(chargerID)

                    socket.send(func.buildJSONMessage([c.CALL_RESULT, uniqueID, c.START_TRANSACTION,
                    // as we have no accounts idTagInfo is 1 as standard
                    { idTagInfo: 1, transactionId: transactionID }]))
                }
            })


        } else {
            console.log("getStartTransactionResponse -> No callback tied to this chargerID OR invalid chargerID")

            if (socket != null) {
                socket.send(func.getGenericError(uniqueID, c.NO_ACTIVE_TRANSACTION))
            }
        }
    }

    function handleDataTransfer(chargerID, uniqueID, request) {
        payload = request[3]
        data = JSON.parse(payload.data)
        switch (payload.messageId) {

            case c.CHARGE_LEVEL_UPDATE:
                updateChargerLevel(chargerID, uniqueID, data)
                break

            default:
                return func.buildJSONMessage([c.CALL_RESULT, uniqueID, c.DATA_TRANSFER, { status: c.UNKOWN_MESSAGE_ID, data: "" }])
        }
    }

    function updateChargerLevel(chargerID, uniqueID, data) {

        socket = v.getConnectedChargerSocket(chargerID)
        if (socket != null) {
            databaseInterfaceTransactions.updateTransactionChargingStatus(
                data.transactionId, data.latestMeterValue, data.CurrentChargePercentage,
                function (error, _) {
                    if (error.length > 0) {
                        console.log("Error updating charger level in DB: " + error)
                        socket.send(func.getGenericError(uniqueID, error.toString()))
                    } else {
                        socket.send(
                            func.buildJSONMessage([c.CALL_RESULT, uniqueID, c.DATA_TRANSFER,
                            { status: c.ACCEPTED, data: "" }]))
                    }
                })
        } else {
            console.log("updateChargerLevel -> No socket connected to this chargerID")
        }
    }

    function sendBootNotificationResponse(chargerID, uniqueID, status) {
        socket = v.getConnectedChargerSocket(chargerID)
        if (socket != null) {
            response = func.buildJSONMessage([
                c.CALL_RESULT,
                uniqueID,
                c.BOOT_NOTIFICATION,
                {
                    status: status,
                    currentTime: Math.floor(Date.now()/1000),
                    interval: c.HEART_BEAT_INTERVALL,
                }
            ])
            socket.send(response)
            console.log("BootNotification response sent")

        } else {
            console.log("sendBootNotificationResponse -> No socket connected to this chargerID")
        }
    }

    function sendBootData(chargerID) {
        getChargingPrice(chargerID, function (error, chargingPrice) {
            socket = v.getConnectedChargerSocket(chargerID)
            if (socket != null) {
                if (error == null) {
                    message = func.getDataTransferMessage(func.getUniqueId(chargerID, c.DATA_TRANSFER),
                        {
                            vendorId: "com.flexicharge", messageId: "BootData",
                            data: JSON.stringify({ chargerId: chargerID, chargingPrice: chargingPrice })
                        },
                        isCall = true)
                    socket.send(message)
                    console.log("BootData sent")
                } else {
                    console.log("Could not get chargePrice. Error: " + error)

                    message = func.getGenericError(c.INTERNAL_ERROR, error.toString())
                    socket.send(message)
                }
            } else {
                console.log("sendBootData -> No socket connected to this chargerID")
            }
        })
    }

    function getChargingPrice(chargerID, callback) {
        databaseInterfaceCharger.getCharger(chargerID, function (error, charger) {
            if (error.length > 0) {
                console.log(error)
                callback(error, null)
            } else {
                if (charger.length == 0) {
                    callback(c.INVALID_ID, null)
                } else {
                    databaseInterfaceChargePoint.getChargePoint(charger.chargePointID, function (error, chargePoint) {
                        if (error.length > 0) {
                            console.log(error)
                            callback(error, null)
                        } else {
                            if (chargePoint.length == 0) {
                                callback(c.INVALID_CHARGE_POINT, null)
                            } else {
                                callback(null, chargePoint.price)
                            }
                        }
                    })
                }
            }
        })
    }
    function sendStatusNotificationResponse(chargerID, uniqueID, request) {
        let errorCode = request[c.PAYLOAD_INDEX].errorCode
        let status = request[c.PAYLOAD_INDEX].status
        if (errorCode != c.NO_ERROR) {
            console.log("\nCharger " + chargerID + " has sent the following error code: " + errorCode)
        }


        databaseInterfaceCharger.updateChargerStatus(chargerID, status, function (error, charger) {
            if (error.length > 0) {
                console.log("Error updating charger status in DB: " + error)
                v.getConnectedChargerSocket(chargerID).send(
                    func.getGenericError(uniqueID, error.toString()))
            } else {
                console.log("Charger updated in DB: " + charger.status)
                v.getConnectedChargerSocket(chargerID).send(
                    func.buildJSONMessage([
                        c.CALL_RESULT,
                        uniqueID,
                        c.STATUS_NOTIFICATION,
                        {} // A response to a StatusNotification can be empty (not defined in protocol)
                    ]))
            }
        })
    }



    function callResultSwitch(uniqueID, response, chargerID) {

        try {
            let action = response[c.ACTION_INDEX]
            console.log("Incoming result call: " + action)
    
            switch (action) {
    
                case c.RESERVE_NOW:
                    if (func.checkIfValidUniqueID(chargerID, uniqueID)) {
                        interfaceHandler.handleReserveNowResponse(chargerID, uniqueID, response)
                    } else {
                        throw c.INVALID_UNIQUE_ID
                    }
                    break
    
                case c.REMOTE_START_TRANSACTION:
                    if (func.checkIfValidUniqueID(chargerID, uniqueID)) {
                        interfaceHandler.handleRemoteStartResponse(chargerID, response)
                    } else {
                        throw c.INVALID_UNIQUE_ID
                    }
                    break
    
                case c.REMOTE_STOP_TRANSACTION:
                    if (func.checkIfValidUniqueID(chargerID, uniqueID)) {
                        interfaceHandler.handleRemoteStopResponse(chargerID, response)
                    } else {
                        throw c.INVALID_UNIQUE_ID
                    }
                    break
    
                case c.DATA_TRANSFER:
                    if(response[c.PAYLOAD_INDEX].status == c.ACCEPTED){
                        console.log('DataTransfer response was OK')
                    } else {
                        throw c.RESPONSE_STATUS_REJECTED
                    }
                    break
    
                default:
                    let socket = v.getConnectedChargerSocket(chargerID)
                    let message = func.getGenericError(uniqueID, "Could not interpret the response for the callcode: " + action)
                    socket.send(message)
                    break
            }
            
        } catch (error) {
            let socket = v.getConnectedChargerSocket(chargerID)
            let message = ""
            switch(error){
                case c.INVALID_UNIQUE_ID:
                    message = func.getGenericError(uniqueID, "Could not found a previous conversation with this unique id.")
                    socket.send(message)
                    break
                case c.RESPONSE_STATUS_REJECTED:
                    message = func.getGenericError(uniqueID, "Request was rejected.")
                    socket.send(message)
                    break
            }
        }

        

    }

    function callErrorSwitch(response) {
        let uniqueID = response[1]
        let errorCode = response[2]
        let callCode = uniqueID.substring(0, 3)
        let chargerID = uniqueID.substring(4, 9)

        var callResult = new String()

        switch (callCode) {
            default:
                console.log("Oops, the charger (" + chargerID + ") responded with an error: " + errorCode)
                break
        }

        return callResult
    }


    return exports
}

