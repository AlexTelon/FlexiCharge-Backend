
module.exports = function({ v, constants, messageHandler }) {
    const c = constants.get()
    
    exports.startTransaction = function(transactionID, chargerID){
        
        //to do, not working
        console.log("Incoming request from API: startTransaction -> transactionId;"+transactionID+" chargerId;"+chargerID)
        messageHandler.sendMessage(c.START_TRANSACTION, transactionID, v.getConnectedSocket(chargerID))
    }

    exports.stopTransaction = function(transactionID, chargerID){

        //to do, not working
        console.log("Incoming request from API: stopTransaction -> transactionId;"+transactionID+" chargerId;"+chargerID)
        messageHandler.sendMessage(c.STOP_TRANSACTION, transactionID, v.getConnectedSocket(chargerID))
    }

    exports.reserveNow = function(chargerID, connectorID, expiryDate, idTag, reservationID, parentIdTag, callback){

        //to do, not working
        console.log("Incoming request from API: changeAvailability -> chargerId;"+chargerID+
        " connectorID;"+connectorID+
        " expiryDate;"+expiryDate+
        " idTag;"+idTag+
        " reservationID;"+reservationID+
        " parentIdTag;"+parentIdTag)

        const dataObject = {
            connectorID: connectorID,
            expiryDate: expiryDate,
            idTag: idTag,
            reservationID: reservationID,
            parentIdTag: parentIdTag
        }
        messageHandler.interfaceHandler(chargerID, c.RESERVE_NOW, dataObject, function(response, error){
            callback(response, error)
        })
    }


    return exports
}