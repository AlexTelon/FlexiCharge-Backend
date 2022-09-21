

module.exports = function({ func, v }){

    exports.handleMessage = function(message, clientSocket, transactionID){
        try {
            let parsedMessage = JSON.parse(message)
            let messageTypeID = data[c.MESSAGE_TYPE_INDEX]
            let uniqueID = data[c.UNIQUE_ID_INDEX] //TODO: Currently not in use

            var response = ""

            switch (messageTypeID) {
                case c.CALL:
                    response = callSwitch(parsedMessage, chargerID, transactionID)
                    break

                case c.CALL_RESULT:
                    callResultSwitch(parsedMessage, chargerID)
                    break

                case c.CALL_ERROR:
                    response = callErrorSwitch(parsedMessage)
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

    function callSwitch(parsedMessage, chargerID, transactionID) {

        let action = parsedMessage[c.ACTION_INDEX]
        console.log("Incoming request call: " + action)
        let callResult = ""

        switch (action) {
            case c.START_LIVESTREAMING:
                handleStartLivestreaming()
            case c.STOP_LIVESTREAMING:
                handleStopLivestreaming()
            default:
                //callResult = func.getCallResultNotImplemeted(uniqueID, action)
                break
        }

        return callResult
    }
    
    function handleStartLivestreaming(parsedMessage, chargerID, transactionID) {
        clientSocket = v.getConnectedAppSocket(transactionID)

        if(clientSocket){
            console.log("\n Livestreaming metrics...")
            payload = parsedMessage[c.PAYLOAD_INDEX]

            socket.send(func.buildJSONMessage([c.CALL_RESULT, payload]))
        }
    }

    function handleStopLivestreaming() {
        //TODO: HANDLE THE INCOMING CALL TO STOP LIVESTREAMING
    }


    return exports
}