module.exports = function ({ v, constants, interfaceHandler, func }) {
    const c = constants.get()

    exports.remoteStartTransaction = function (connectorID, transactionID, callback) {

        console.log("Incoming request from API: startTransaction -> connectorID;")

        v.addTransactionID(connectorID, transactionID)

        const payload = {
            connectorID: connectorID,
            //we don't have users so always set to 1
            idTag: 1,
        }
        interfaceHandler.interfaceHandler(connectorID, c.REMOTE_START_TRANSACTION, payload, callback)
    }

    exports.remoteStopTransaction = function (connectorID, transactionID, callback) {

        console.log("Incoming request from API: stopTransaction -> transactionId;" + transactionID + " connectorID;" + connectorID)

        const payload = {
            transactionID: transactionID
        }
        interfaceHandler.interfaceHandler(connectorID, c.REMOTE_STOP_TRANSACTION, payload, callback)
    }


    //Need a callback function with the parameters "response" and "error", it will callback when the server got a response from the charger.
    //The response have 1 error as of now, "InvalidId". if error occur the response will be null. If no errors occours the erro will be null.
    //If the charger accepts the reservation the response will be "Accepted" if the reservation went through
    //otherwise it will be one of this responses: "Faulted", "Occupied", "Rejected" or "Unavailable".
    exports.reserveNow = function (connectorID, idTag, parentIdTag, callback) {

        console.log("Incoming request from API: reserveNow -> connectorID:" + connectorID)

        const payload = {
            connectorID: connectorID,
            idTag: idTag,
            reservationID: func.getReservationID(connectorID, 1, 1),
            parentIdTag: parentIdTag // Optional according to OCPP
        }
        interfaceHandler.interfaceHandler(connectorID, c.RESERVE_NOW, payload, callback)
    }

    return exports
}
