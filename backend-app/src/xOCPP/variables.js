const connectedSockets = {}
const chargerSerials = []
const chargerIDs = {}

module.exports = function ({ }) {
    
    // CONNECTED SOCKETS
    // Get socket with charger IDs
    exports.getConnectedSocket = function (id) {
        return connectedSockets[id]
    }
    exports.addConnectedSockets = function (id, socket) {
        connectedSockets[id] = socket
    }
    exports.removeConnectedSockets = function (id) {
        delete connectedSockets[id]
    }
    exports.getLengthConnectedSockets = function () {
        return Object.keys(connectedSockets).length
    }

    
    // CHARGER SERIALS
    // Array with all the serial numbers
    exports.getChargerSerials = function () {
        return chargerSerials
    }
    exports.addChargerSerials = function (serial) {
        chargerSerials.push(serial)
    }
    exports.removeChargerSerials = function (serial) {
        var chargerSerialsIndex = chargerSerials.indexOf(serial)
        chargerSerials.splice(chargerSerialsIndex)
    }
    exports.getLengthChargerSerials = function () {
        return chargerSerials.length
    }
    exports.isInChargerSerials = function (serial) {
        return chargerSerials.includes(serial)
    }


    // CHARGER IDS
    // get charger ID with serial number
    exports.getChargerID = function (serial) {
        return chargerIDs[serial]
    }
    exports.addChargerIDs = function (serial, id) {
        chargerIDs[serial] = id
    }
    exports.removeChargerIDs = function (serial) {
        delete chargerIDs[serial]
    }
    exports.getLengthChargerIDs = function () {
        return Object.keys(chargerIDs).length
    }

    return exports
}