const connectedSockets = {}
const chargerSerials = []
const appIDs = []
const chargerIDs = {}
const callbacks = {}
const transactionIDs = {}

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

    //APP IDS 
    //Array with all the app ids
    exports.getAppIDs = function () {
        return appIDs
    }
    exports.addAppID = function (id) {
        appIDs.push(id)
    }
    exports.removeAppID = function (id) {
        const appIDIndex = appIDs.indexOf(id)
        appIDs.splice(appIDIndex)
    }
    exports.getLengthAppIDs = function () {
        return appIDs.length
    }
    exports.isInAppIDs = function (id) {
        return appIDs.includes(id)
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
}