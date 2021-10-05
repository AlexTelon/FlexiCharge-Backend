
module.exports = function({ v, constants, messageHandler, interfaceHandler, func }) {
    const c = constants.get()
    
    exports.remoteStartTransaction = function(connectorID, chargerID, idTag, callback){
        
        console.log("Incoming request from API: startTransaction -> chargerId;"+chargerID)

        const dataObject = {
            connectorID: connectorID,
            idTag: idTag,
        }

        interfaceHandler.interfaceHandler(chargerID, c.REMOTE_START_TRANSACTION, dataObject, callback)
    }

    exports.remoteStopTransaction = function(transactionID, chargerID){

        //to do, not working
        console.log("Incoming request from API: stopTransaction -> transactionId;"+transactionID+" chargerId;"+chargerID)
        messageHandler.sendMessage(c.STOP_TRANSACTION, transactionID, v.getConnectedSocket(chargerID))
    }


    //Need a callback function with the parameters "response" and "error", it will callback when the server got a response from the charger. 
    //The response have 1 error as of now, "InvalidId". if error occur the response will be null. If no errors occours the erro will be null.
    //If the chareger accepts the reservation the response will be "Accepted" if the reservation went through
    //othervise it will be one of this responses: "Faulted", "Occupied", "Rejected" or "Unavailable".
    exports.reserveNow = function(chargerID, connectorID, idTag, reservationID, parentIdTag, callback){

        console.log("Incoming request from API: reserveNow -> chargerId:"+chargerID)

        const dataObject = {
            connectorID: connectorID,
            idTag: idTag,
            reservationID: v.getReservationID(),
            parentIdTag: parentIdTag
        }
        interfaceHandler.interfaceHandler(chargerID, c.RESERVE_NOW, dataObject, callback)
    }

    


    return exports
}