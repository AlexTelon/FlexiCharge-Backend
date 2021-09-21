const { NOW } = require("sequelize")

module.exports = function({constants}) {

    exports.handleMessage = function(clientSocket) {
        
        clientSocket.on('message', function incoming(message) {
            var request = JSON.parse(message)
            var messageTypeID = request[0]
            var action = request[2]
            
            console.log("Incoming request call: " + action)

            var response = ""

            switch(messageTypeID) {
                case constants.getMessageTypeID().CALL:
                    response = callSwitch(request)

                case constants.getMessageTypeID().CALLRESULT:
                    response = callResultSwitch(request)

                case constants.getMessageTypeID().CALLERROR:
                    response = callErrorSwitch(request)

                default:
                    response = JSON.stringify('[4, ' + callID + ',"GenericError","MessageTypeID is invalid",{}]')

            }
    
            clientSocket.send(response)
        })
    }
    return exports
}

function callSwitch(request) {
    let callID = request[1]
    let action = request[2]

    var callResult = ""
    switch(action) {
        case "BootNotification":
        callResult = JSON.stringify('[3,' + callID + ',{"status":"Accepted","currentTime":' + new Date(NOW).toISOString() + ',"interval":86400}]')
            
        default:
        callResult = JSON.stringify('[4, ' + callID + ',"NotImplemented","This function is not implemented.",{}]')
            
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
    }
    return callResult
}

function callErrorSwitch() {
    let callID = response[1]
    let callCode = callID.substring(0,3)
    let chargerID = callID.substring(4,9)

    var callResult = ""
    switch(callCode) {
        default:
            callResult = JSON.stringify('[4, ' + callID + ',"NotImplemented","This function is not implemented.",{}]') 
    }

    return callResult
}