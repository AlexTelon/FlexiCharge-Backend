module.exports = function ({ func, constants, v, databaseInterfaceCharger }) {
    const c = constants.get()

    exports.interfaceHandler = function (connectorID, action, payload, callback) {

        try {
            const socket = v.getConnectedChargerSocket(connectorID)
            if (socket != null) {

                var message = ""

                switch (action) {

                    case c.RESERVE_NOW:
                        message = getMessageReserveNowCall(connectorID, action, payload, callback)
                        break

                    case c.REMOTE_START_TRANSACTION:
                        message = getMessageRemoteStartCall(connectorID, action, payload, callback)
                        break

                    case c.REMOTE_STOP_TRANSACTION:
                        message = getMessageRemoteStopCall(connectorID, action, payload, callback)
                        break
                }
                console.log("This is sent: from interfaceHandler " + message)
                socket.send(message)

            } else {
                console.log("Got no valid connectorID from API.")
                callback(c.INVALID_ID, [])
            }

        } catch (error) {
            callback(error.toString(), [])
        }


    }


    /************************************************************
     * RESERVE NOW FUNCTIONS
     **************************************************************/
    function getMessageReserveNowCall(connectorID, action, dataObject, callback) {
        let uniqueID = func.getUniqueId(connectorID, action)
        let message = func.buildJSONMessage([
            c.CALL,
            uniqueID,
            c.RESERVE_NOW,
            {
                connectorID: dataObject.connectorID,
                expiryDate: Math.floor(Date.now() / 1000) + c.RESERVATION_TIME,
                idTag: dataObject.idTag,
                reservationID: dataObject.reservationID,
                parentIdTag: dataObject.parentIdTag
            }
        ])
        v.addCallback(uniqueID, callback)
        return message

    }

    exports.handleReserveNowResponse = function (connectorID, uniqueID, response) {

        let status = response[c.PAYLOAD_INDEX].status
        console.log("\nCharger " + connectorID + " responded to ReserveNow request: " + status)

        let callback = v.getCallback(uniqueID)
        v.removeCallback(uniqueID)

        if (callback != null) {
            if (status == c.ACCEPTED) {

                databaseInterfaceCharger.updateChargerStatus(connectorID, c.RESERVED, function (error, charger) {
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
            socket = v.getConnectedChargerSocket(connectorID)
            if (socket != null) {
                socket.send(func.getGenericError(c.INTERNAL_ERROR, C.NOT_AN_ACTIVE_CONVERSATION))
                console.log("handleReserveNowResponse -> No callback tied to this unuiqueID")
            } else {
                console.log("handleReserveNowResponse -> No callback tied to this unuiqueID and no socket connected to this connectorID.")
            }
        }
    }

    /************************************************************
     * REMOTE START FUNCTIONS
     **************************************************************/
    function getMessageRemoteStartCall(connectorID, action, payload, callback) {
        let uniqueID = func.getUniqueId(connectorID, action)
        let message = func.buildJSONMessage([
            c.CALL,
            uniqueID,
            c.REMOTE_START_TRANSACTION,
            payload
        ])
        v.addCallback(connectorID, callback)
        return message
    }

    exports.handleRemoteStartResponse = function (connectorID, response) {
        let status = response[c.PAYLOAD_INDEX].status
        console.log("\nCharger " + connectorID + " responded to RemoteStartTransaction request: " + status)
        if (status == c.ACCEPTED) {
            console.log("Waiting for StartTransaction...")
        } else {
            let callback = v.getCallback(connectorID)

            if (callback != null) {
                callback(null, { status: status })
                v.removeCallback(connectorID)
            } else {
                socket = v.getConnectedChargerSocket(connectorID)
                if (socket != null) {
                    socket.send(func.getGenericError(c.INTERNAL_ERROR, C.NOT_AN_ACTIVE_CONVERSATION))
                    console.log("handleRemoteStartResponse -> No callback tied to this connectorID")
                } else {
                    console.log("handleRemoteStartResponse -> No callback tied to this unuiqueID and no socket connected to this connectorID.")
                }

            }
        }
    }

    /************************************************************
     * REMOTE STOP FUNCTIONS
     **************************************************************/
    function getMessageRemoteStopCall(connectorID, action, payload, callback) {
        let uniqueID = func.getUniqueId(connectorID, action)
        let message = func.buildJSONMessage([
            c.CALL,
            uniqueID,
            c.REMOTE_STOP_TRANSACTION,
            payload
        ])
        v.addCallback(connectorID, callback)
        return message
    }

    exports.handleRemoteStopResponse = function (connectorID, response) {
        let status = response[c.PAYLOAD_INDEX].status
        console.log("\nCharger " + connectorID + " responded to RemoteStopTransaction request: " + status)
        if (status == c.ACCEPTED) {
            console.log("Waiting for StopTransaction...")
        } else {
            let callback = v.getCallback(connectorID)
            if (callback != null) {
                callback(null, { status: status })
                v.removeCallback(connectorID)
            } else {
                socket = v.getConnectedChargerSocket(connectorID)
                if (socket != null) {
                    socket.send(func.getGenericError(c.INTERNAL_ERROR, C.NOT_AN_ACTIVE_CONVERSATION))
                    console.log("handleRemoteStopResponse -> No callback tied to this connectorID")
                } else {
                    console.log("handleRemoteStopResponse -> No callback tied to this unuiqueID and no socket connected to this connectorID.")
                }

            }
        }
    }

    return exports
}