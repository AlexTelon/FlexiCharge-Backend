module.exports = function({ func, constants, v, databaseInterfaceCharger }) {
    const c = constants.get()

    exports.interfaceHandler = function(chargerID, action, payload, callback) {

        try {
            const socket = v.getConnectedSocket(chargerID)

            if (socket != null) {

                var message = ""

                switch (action) {

                    case c.RESERVE_NOW:
                        message = getMessageReserveNowCall(chargerID, action, payload, callback)
                        break

                    case c.REMOTE_START_TRANSACTION:
                        message = getMessageRemoteStartCall(chargerID, action, payload, callback)
                        break

                    case c.REMOTE_STOP_TRANSACTION:
                        message = getMessageRemoteStopCall(chargerID, action, payload, callback)
                        break
                }

                socket.send(message)

            } else {
                console.log("Got no valid chargerID from API.")
                callback(c.INVALID_ID, [])
            }

        } catch (error) {
            callback(error.toString(), [])
        }


    }


    /************************************************************
     * RESERVE NOW FUNCTIONS
     **************************************************************/
    function getMessageReserveNowCall(chargerID, action, dataObject, callback) {
        let uniqueID = func.getUniqueId(chargerID, action)
        let message = func.buildJSONMessage([
            c.CALL,
            uniqueID,
            c.RESERVE_NOW,
            {
                connectorID: dataObject.connectorID,
                expiryDate: Date.now() + c.RESERVATION_TIME,
                idTag: dataObject.idTag,
                reservationID: dataObject.reservationID,
                parentIdTag: dataObject.parentIdTag
            }
        ])
        v.addCallback(uniqueID, callback)
        return message

    }

    exports.handleReserveNowResponse = function(chargerID, uniqueID, response) {

        let status = response[c.PAYLOAD_INDEX].status
        console.log("\nCharger " + chargerID + " responded to ReserveNow request: " + status)

        callback = v.getCallback(uniqueID)
        v.removeCallback(uniqueID)

        if (callback != null) {
            if (status == c.ACCEPTED) {

                databaseInterfaceCharger.updateChargerStatus(chargerID, c.RESERVED, function (error, charger) {
                    if (error.length > 0) {
                        console.log("\nError updating charger status in DB: " + error)
                        callback(c.INTERNAL_ERROR, null)
                    } else {
                        console.log("\nCharger updated in DB: " + charger.status)
                        callback(null, status)
                    }
                })
            } else {
                callback(null, status)
            }
        } else {
            socket = v.getConnectedSocket(chargerID)
            if (socket != null) {
                socket.send(func.getGenericError(c.INTERNAL_ERROR, C.NOT_AN_ACTIVE_CONVERSATION))
                console.log("handleReserveNowResponse -> No callback tied to this unuiqueID")
            } else {
                console.log("handleReserveNowResponse -> No callback tied to this unuiqueID and no socket connected to this chargerID.")
            }

        }
    }

    /************************************************************
     * REMOTE START FUNCTIONS
     **************************************************************/
    function getMessageRemoteStartCall(chargerID, action, payload, callback) {
        let uniqueID = func.getUniqueId(chargerID, action)
        let message = func.buildJSONMessage([
            c.CALL,
            uniqueID,
            c.REMOTE_START_TRANSACTION,
            payload
        ])
        v.addCallback(chargerID, callback)
        return message
    }

    exports.handleRemoteStartResponse = function(chargerID, response) {
        let status = response[c.PAYLOAD_INDEX].status
        console.log("\nCharger " + chargerID + " responded to RemoteStartTransaction request: " + status)
        if (status == c.ACCEPTED) {
            console.log("Waiting for StartTransaction...")
        } else {
            let callback = v.getCallback(chargerID)
            if (callback != null) {
                callback(null, { status: status })
                v.removeCallback(chargerID)
            } else {
                socket = v.getConnectedSocket(chargerID)
                if (socket != null) {
                    socket.send(func.getGenericError(c.INTERNAL_ERROR, C.NOT_AN_ACTIVE_CONVERSATION))
                    console.log("handleRemoteStartResponse -> No callback tied to this chargerID")
                } else {
                    console.log("handleRemoteStartResponse -> No callback tied to this unuiqueID and no socket connected to this chargerID.")
                }

            }
        }
    }

    /************************************************************
     * REMOTE STOP FUNCTIONS
     **************************************************************/
    function getMessageRemoteStopCall(chargerID, action, payload, callback) {
        let uniqueID = func.getUniqueId(chargerID, action)
        let message = func.buildJSONMessage([
            c.CALL,
            uniqueID,
            c.REMOTE_STOP_TRANSACTION,
            payload
        ])
        v.addCallback(chargerID, callback)
        return message
    }

    exports.handleRemoteStopResponse = function(chargerID, response) {
        let status = response[c.PAYLOAD_INDEX].status
        console.log("\nCharger " + chargerID + " responded to RemoteStopTransaction request: " + status)
        if (status == c.ACCEPTED) {
            console.log("Waiting for StopTransaction...")
        } else {
            callback = v.getCallback(chargerID)
            if (callback != null) {
                callback(null, { status: status })
                v.removeCallback(chargerID)
            } else {
                socket = v.getConnectedSocket(chargerID)
                if (socket != null) {
                    socket.send(func.getGenericError(c.INTERNAL_ERROR, C.NOT_AN_ACTIVE_CONVERSATION))
                    console.log("handleRemoteStopResponse -> No callback tied to this chargerID")
                } else {
                    console.log("handleRemoteStopResponse -> No callback tied to this unuiqueID and no socket connected to this chargerID.")
                }

            }
        }
    }

    return exports
}