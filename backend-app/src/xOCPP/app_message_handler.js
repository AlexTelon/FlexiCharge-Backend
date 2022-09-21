

module.exports = function({ func, v }){

    exports.handleMessage = function(message, appClientSocket, transactionID){
        try {
            let parsedMessage = JSON.parse(message)
            let messageTypeID = data[c.MESSAGE_TYPE_INDEX]
            let uniqueID = data[c.UNIQUE_ID_INDEX] //TODO: Currently not in use

            switch (messageTypeID) {
                case c.CALL:
                    callSwitch(parsedMessage, appClientSocket, transactionID)
                    break

                case c.CALL_RESULT:
                    //callResultSwitch(parsedMessage, chargerID)
                    break
                    
                case c.CALL_ERROR:
                    //callErrorSwitch(parsedMessage)
                    break

                default:
                    clientSocket.send(func.getGenericError(uniqueID, "MessageTypeID is invalid"))
                    break
            }
        } catch (error) {
            console.log(error)
            clientSocket.send(func.getGenericError(c.INTERNAL_ERROR, error.toString()))
        }
    }

    function callSwitch(parsedMessage, chargerID, transactionID) {

        let action = parsedMessage[c.ACTION_INDEX]
        console.log("Incoming request call: " + action)

        switch (action) {
            case c.START_LIVESTREAMING:
                handleStartLivestreaming()
            case c.STOP_LIVESTREAMING:
                handleStopLivestreaming()
            default:
                //callResult = func.getCallResultNotImplemeted(uniqueID, action)
                break
        }
    }
    
    function handleStartLivestreaming(parsedMessage, appClientSocket, transactionID) {

        //TODO: run test code here to make sure that a chargerID can be retrieved, for internal testing only
        const chargerID = v.getChargerIdByTransactionID(transactionID)
        const chargerClientSocket = v.getConnectedChargerSocket(chargerID)
        
        if(!appClientSocket || !chargerClientSocket){
            //TODO: Error here
            return
        }
        console.log("\n Livestreaming started :oooo...")

        //TODO: IMPLEMENT AUTHORIZATION / AUTHENTICATION

        //if authenticated
        appClientSocket.send(func.buildJSONMessage([
            c.CALL_RESULT, 
            'someUniqueID', 
            c.START_LIVESTREAMING, 
            {status: c.ACCEPTED}
        ]))

        chargerClientSocket.send(func.buildJSONMessage([
            c.CALL,
            'someUniqueID',
            c.START_LIVESTREAMING,
            {}
        ]))

    }

    function handleStopLivestreaming() {
        //TODO: HANDLE THE INCOMING CALL TO STOP LIVESTREAMING
    }


    return exports
}