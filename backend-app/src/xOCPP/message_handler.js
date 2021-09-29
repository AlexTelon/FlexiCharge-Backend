module.exports = function({constants}) {

    exports.handleMessage = function(message, clientSocket, chargerID) {
        let request = JSON.parse(message)
            let messageTypeID = request[0]
            let callID = request[1]
            let action = request[2]
            
            console.log("Incoming request call: " + action)

            var response = ""
            let tmpResponse = new Array()

            switch(messageTypeID) {
                case constants.getConstants().CALL:
                    response = callSwitch(request, chargerID)
                    break

                case constants.getConstants().CALLRESULT:
                    response = callResultSwitch(request)
                    break

                case constants.getConstants().CALLERROR:
                    response = callErrorSwitch(request)
                    break

                default:
                    tmpResponse.push(4)
                    tmpResponse.push(callID)
                    tmpResponse.push("GenericError")
                    tmpResponse.push("MessageTypeID is invalid")
                    tmpResponse.push(new Object())
                    response = JSON.stringify(tmpResponse)
                    break
            }
            clientSocket.send(response)
    }
    return exports
}



function callSwitch(request, chargerID) {
    let callID = request[1]
    let action = request[2]

    var callResult = new String()
    let response = new Array()
    let resultBody = new Object()

    switch(action) {
        case "BootNotification":
            if(chargerID != null){
                response.push(3)
                response.push(callID)
                resultBody.status = "Accepted"
                resultBody.currentTime = new Date().toISOString()
                resultBody.interval = 86400
                resultBody.chargerID = chargerID
                response.push(resultBody)
               
                callResult = JSON.stringify(response)
            
            } else {
                response.push(4)
                response.push(callID)
                response.push("InternalError")
                response.push("Contact OCPP gang :)")
                response.push(new Object())

                callResult = JSON.stringify(response)
            }
            break

        default:
            response.push(4)
            response.push(callID)
            response.push("NotImplemented")
            response.push("This function is not implemented.")
            response.push(new Object())

            callResult = JSON.stringify(response)
            break
        }

    return callResult
}

function callResultSwitch(response) {
    let callID = response[1]
    let callCode = callID.substring(0,3)
    let chargerID = callID.substring(4,9)

    var callResult = new String()
    let reply = new Array()
    let resultBody = new Object()

    switch(callCode) {
        default:
            reply.push(4)
            reply.push(callID)
            reply.push("NotImplemented")
            reply.push("This function is not implemented.")
            reply.push(new Object())

            callResult = JSON.stringify(reply)
            break
    }
    return callResult
}

function callErrorSwitch(response) {
    let callID = response[1]
    let callCode = callID.substring(0,3)
    let chargerID = callID.substring(4,9)

    var callResult = new String()
    let reply = new Array()
    let resultBody = new Object()

    switch(callCode) {
        default:
            reply.push(4)
            reply.push(callID)
            reply.push("NotImplemented")
            reply.push("This function is not implemented.")
            reply.push(new Object())

            callResult = JSON.stringify(reply)
        break
    }

    return callResult
}