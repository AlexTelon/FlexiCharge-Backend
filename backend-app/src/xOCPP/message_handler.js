module.exports = function({constants}) {

    exports.handleMessage = function(message, clientSocket, chargerID) {
        let request = JSON.parse(message)
            let messageTypeID = request[0]
            let callID = request[1]
            let action = request[2]
            
            console.log("Incoming request call: " + action)

            var response = ""

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
                    response = JSON.stringify('[4, ' + callID + ',"GenericError","MessageTypeID is invalid",{}]')
                    break
            }
            clientSocket.send(response)
    }
    return exports
}



function callSwitch(request, chargerID) {
    let callID = request[1]
    let action = request[2]

    var callResult = ""
    switch(action) {
        case "BootNotification":
            if(chargerID != null){
               callResult = JSON.stringify('[3,' + callID + ',{"status":"Accepted","currentTime":' + new Date().toISOString() + ',"interval":86400,"chargerID":'+chargerID+'}]') 
            }else{
                callResult = JSON.stringify('[4, ' + callID + ',"InternalError","Contact OCPP gang :)",{}]')
            }
            
            break
        default:
            callResult = JSON.stringify('[4, ' + callID + ',"NotImplemented","This function is not implemented.",{}]')
            break
        }

    return callResult
}

function callResultSwitch(response) {
    let callID = response[1]
    let callCode = callID.substring(0,3)
    let chargerID = callID.substring(4,9)

    var callResult = ""
    switch(callCode) {
        default:
            callResult = JSON.stringify('[4, ' + callID + ',"NotImplemented","This function is not implemented.",{}]') 
            break
    }
    return callResult
}

function callErrorSwitch(response) {
    let callID = response[1]
    let callCode = callID.substring(0,3)
    let chargerID = callID.substring(4,9)

    var callResult = ""
    switch(callCode) {
        default:
            callResult = JSON.stringify('[4, ' + callID + ',"NotImplemented","This function is not implemented.",{}]') 
        break
    }

    return callResult
}