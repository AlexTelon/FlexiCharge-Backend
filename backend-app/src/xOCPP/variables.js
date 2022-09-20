const connectedChargerSockets = {}
const connectedAppSockets = []
const chargerSerials = []
const appTransactionIDs = []
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

    // CONNECTED APP SOCKETS
    // Get app socket with transactionIDs 
    exports.getConnectedAppSocket = function (transactionID) {
        return connectedAppSockets[transactionID]
    }
    exports.addConnectedAppSockets = function (transactionID, socket) {
        connectedAppSockets[transactionID] = socket
    }
    exports.removeConnectedAppSockets = function (transactionID) {
        delete connectedAppSockets[transactionID]
    }
    exports.getLengthConnectedAppSockets = function () {
        return Object.keys(connectedAppSockets).length
    }

    //APP IDS 
    //Array with all the app ids
    exports.getTransactionIDs = function () {
        return appTransactionIDs
    }
    exports.addAppTransactionID = function (transactionID) {
        appTransactionIDs.push(transactionID)
    }
    exports.removeAppTransactionID = function (transactionID) {
        const appTransactionIDIndex = appTransactionIDs.indexOf(transactionID)
        appTransactionIDs.splice(appTransactionIDIndex)
    }
    exports.getLengthAppIDs = function () {
        return appTransactionIDs.length
    }
    exports.isInAppIDs = function (transactionID) {
        return appTransactionIDs.includes(transactionID)
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