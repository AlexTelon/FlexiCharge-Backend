
module.exports = function({ v, constants, interfaceHandler, func }) {
    const c = constants.get()
    
    exports.remoteStartTransaction = function(chargerID, transactionID, callback){
        
        console.log("Incoming request from API: startTransaction -> chargerId;"+chargerID)

        v.addTransactionID(chargerID, transactionID)

        const payload = {
            //is set to one as we assume there is only one connector per charger
            connectorID: 1,
            //we don't have useres so allwasy set to 1
            idTag: 1,
        }
        interfaceHandler.interfaceHandler(chargerID, transactionID, c.REMOTE_START_TRANSACTION, payload, callback)
    }

    exports.remoteStopTransaction = function(chargerID, transactionID, callback){

        //to do, not working
        console.log("Incoming request from API: stopTransaction -> transactionId;"+transactionID+" chargerId;"+chargerID)
        
        const payload = {
            transactionID: transactionID
        }
        interfaceHandler.interfaceHandler(chargerID, c.REMOTE_STOP_TRANSACTION, payload, callback)
    }


    //Need a callback function with the parameters "response" and "error", it will callback when the server got a response from the charger. 
    //The response have 1 error as of now, "InvalidId". if error occur the response will be null. If no errors occours the erro will be null.
    //If the chareger accepts the reservation the response will be "Accepted" if the reservation went through
    //othervise it will be one of this responses: "Faulted", "Occupied", "Rejected" or "Unavailable".
    exports.reserveNow = function(chargerID, connectorID, idTag, reservationID, parentIdTag, callback){

        console.log("Incoming request from API: reserveNow -> chargerId:"+chargerID)

        const payload = {
            connectorID: connectorID,
            idTag: idTag,
            reservationID: func.getReservationID(chargerID, idTag, connectorID),
            parentIdTag: parentIdTag
        }
        interfaceHandler.interfaceHandler(chargerID, c.RESERVE_NOW, payload, callback)
    }

    


    return exports
}