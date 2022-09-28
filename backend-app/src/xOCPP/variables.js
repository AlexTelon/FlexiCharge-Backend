const connectedChargerSockets = {}
const chargerSerials = []
const chargerIDs = {}
const callbacks = {}
const transactionIDs = {}

module.exports = function ({ }) {
    
    // CONNECTED CHARGER SOCKETS
    // Get charger socket with charger IDs
    exports.getConnectedChargerSocket = function (id) {
        return connectedChargerSockets[id]
    }
    exports.addConnectedChargerSockets = function (id, socket) {
        connectedChargerSockets[id] = socket
    }
    exports.removeConnectedChargerSockets = function (id) {
        delete connectedChargerSockets[id]
    }
    exports.getLengthConnectedChargerSockets = function () {
        return Object.keys(connectedChargerSockets).length
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


    //CALLBACKS
    //get callback with some type of id
    exports.getCallback = function (id) {
        return callbacks[id]
    }
    exports.addCallback = function (id, callback) {
        callbacks[id] = callback
    }
    exports.removeCallback = function (id) {
        delete callbacks[id]
    }
    

    //TRANSACTIONIDS
    //get transactionID with chargerID
    exports.getTransactionID = function (chargerID) {
        return transactionIDs[chargerID]
    }
    exports.addTransactionID = function (chargerID, transactionID) {
        transactionIDs[chargerID] = transactionID
    }
    exports.removeTransactionID = function (chargerID) {
        delete transactionIDs[chargerID]
    }

    return exports
}