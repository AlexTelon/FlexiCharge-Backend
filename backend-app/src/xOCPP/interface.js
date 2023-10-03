
module.exports = function({ v, constants, interfaceHandler, func }) {
    const c = constants.get()
    
    exports.remoteStartTransaction = function(chargerID, transactionID, callback){
        
        console.log("Incoming request from API: startTransaction -> chargerId;")

        v.addTransactionID(chargerID, transactionID)

        const payload = {
            //is set to one as we assume there is only one connector per charger
            connectorID: 1,
            //we don't have useres so allwasy set to 1
            idTag: 1,
        }
        interfaceHandler.interfaceHandler(chargerID, c.REMOTE_START_TRANSACTION, payload, callback)
    }

    exports.remoteStopTransaction = function(chargerID, transactionID, callback){

        //to do, not working (EDIT 2022-09-22: Klarna in DAL is not working, therefor this is not working)
        console.log("Incoming request from API: stopTransaction -> transactionId;"+transactionID+" chargerId;"+chargerID)
        
        const payload = {
            transactionID: transactionID
        }
        interfaceHandler.interfaceHandler(chargerID, c.REMOTE_STOP_TRANSACTION, payload, callback)
    }


    //A callback function is implemented with the parameters "response" and "error.".
    //This callback function is designed to be invoked when a response is received from  the charger server.
    exports.reserveNow = function(chargerID, connectorID, idTag, reservationID, parentIdTag, callback){

        console.log("Incoming request from API: reserveNow -> chargerId:"+chargerID)

        const payload = {
            connectorID: 1,
            idTag: 1,
            reservationID: func.getReservationID(chargerID, 1, 1),
            parentIdTag: 1
        }
        interfaceHandler.interfaceHandler(chargerID, c.RESERVE_NOW, payload, function(response, error) {
            if (error === "InvalidId") {
                console.error("Reservation Error: Invalid ID");
                response = null;
            }
            callback(response, error);
        });
    };

    return exports
}