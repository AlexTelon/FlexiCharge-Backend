module.exports = function ({ constants, func }) {
    const c = constants.get()

    exports.handleMessage = function (message, clientSocket, chargerID) {
        let request = JSON.parse(message)
        let messageTypeID = request[0]
        let uniqueID = request[1]

        var response = ""

        switch (messageTypeID) {
            case c.CALL:
                
                response = callSwitch(uniqueID, request, chargerID)
                break

            case c.CALL_RESULT:

                response = callResultSwitch(uniqueID, request)
                break

            case c.CALL_ERROR:

                response = callErrorSwitch(uniqueID, request)
                break

            default:

                response = getGenericError(uniqueID, "MessageTypeID is invalid")
                break
        }
        clientSocket.send(response)
    }

    exports.interfaceStartCall = function (action, transactionID, socket) {
        //to do
        interfaceStartCallSwitch()
    }

    exports.buildJSONMessage = function (messageArray) {
        const message = []
        messageArray.forEach(i => {
            message.push(i)
        })
        
        return JSON.stringify(message)
    }


    function interfaceStartCallSwitch() {
        //todo
    }
    
    
    
    function callSwitch(uniqueID, request, chargerID) {
    
        let action = request[2]
        console.log("Incoming request call: " + action)
        let callResult = ""
    
        switch (action) {
            case c.BOOT_NOTIFICATION:
                if (chargerID != null) {
                    callResult = messageHandler.buildJSONMessage([c.CALL_RESULT, uniqueID, 
                        {status:"Accepted",
                        currentTime: new Date().toISOString(),
                        interval: c.HEART_BEAT_INTERVALL,
                        chargerId: chargerID}])
    
                } else {
                    callResult = messageHandler.buildJSONMessage([c.CALL_ERROR, uniqueID, c.INTERNAL_ERROR,
                        "Tell OCPP gang that error *no chargerID in callSwitch -> BOOT_NOTIFICATION* occured :)", {}])
                }
                break
    
            case c.START_TRANSACTION:
                //todo
                callResult = getCallResultNotImplemeted(uniqueID, action)
                break
    
            case c.STOP_TRANSACTION:
                //todo
                callResult = getCallResultNotImplemeted(uniqueID, action)
                break
    
            default:
                callResult = getCallResultNotImplemeted(uniqueID, action)
                break
        }
    
        return callResult
    }
    
    function callResultSwitch(response) {
        let uniqueID = response[1]
        let callCode = uniqueID.substring(0,3)
        let chargerID = uniqueID.substring(4,9)
    
        var callResult = ""
    
    
        switch(callCode) {
            default:
                callResult = getGenericError(uniqueID, "Could not interpret the response for the callcode: "+callCode)
                break
        }
        return callResult
    }
    
    function callErrorSwitch(response) {
        let uniqueID = response[1]
        let errorCode = response[2]
        let callCode = uniqueID.substring(0,3)
        let chargerID = uniqueID.substring(4,9)
    
        var callResult = new String()
    
        switch(callCode) {
            default:
            console.log("Ops, the charger responded with an error: "+errorCode)
            break
        }
    
        return callResult
    }
    
    function getCallResultNotImplemeted(uniqueID, operation) {
        return messageHandler.buildJSONMessage([c.CALL_ERROR, uniqueID, c.NOT_IMPLEMENTED, "The *"+operation+"* function is not implemented yet.", {}])
    }
    
    function getGenericError(uniqueID, errorDescription) {
        return messageHandler.buildJSONMessage([c.CALL_ERROR, uniqueID, c.GENERIC_ERROR, errorDescription, {}])
    }

    return exports
}

