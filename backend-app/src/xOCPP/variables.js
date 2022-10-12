const connectedChargerSockets = {}
const connectedUserSockets = {}
const chargerSerials = []

//Stored under transactionID index
const userIDs = []

const liveMetricsTokens = {}
const chargerIDs = {}
const callbacks = {}
const transactionIDs = {}
const lastLiveMetricsTimestamps = []

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

    // CONNECTED USER SOCKETS
    // Get user socket with userIDs 
    exports.getConnectedUserSocket = function (userID) {
        return connectedUserSockets[userID]
    }
    exports.addConnectedUserSocket = function (userID, socket) {
        connectedUserSockets[userID] = socket
    }
    exports.removeConnectedUserSocket = function (userID) {
        delete connectedUserSockets[userID]
    }
    exports.getLengthConnectedUserSockets = function () {
        return Object.keys(connectedUserSockets).length
    }

    //USER IDS 
    //Array with all the user ids under transactionIDs index
    exports.addUserIDWIthTransactionID = function(userID, transactionID){
        userIDs[transactionID] = userID
    }
    exports.getUserIDWithTransactionID = function(transactionID){
        return userIDs[transactionID]
    }
    exports.removeUserID = function(userID){
        for(i = 0; i < userIDs.length; i += 1){
            if(userIDs[i] == userID){
                delete userIDs[i]
            }
        }
    }
    exports.isInUserIDs = function (userID) {
        return userIDs.includes(userID)
    }
    exports.getUserIDsLength = function(){
        return Object.keys(userIDs).length
    }
    exports.getTransactionIDwithUserID = function(userID){
        return userIDs.indexOf(userID)
    }

    //LIVE METRICS TOKENS
    //Array with all the PubSub tokens for all subscribers, stored under userID
    exports.getLiveMetricsToken = function(userID){
        return liveMetricsTokens[userID]
    }
    exports.addLiveMetricsToken = function(userID, token) {
        liveMetricsTokens[userID] = token

        // liveMetricsToken = {
        //     "tjijgioerjgiore-gjruijgeruigh": token // only supports one token per userID
        // }
    }
    exports.removeLiveMetricsToken = function(userID){
        delete liveMetricsTokens[userID]
    }
    exports.getLiveMetricsTokensLength = function(){
        return Object.keys(liveMetricsTokens).length
    }

    //LAST LIVE METRICS DB TIMESTAMPS
    //Array with last live metrics timestamps, stored under a transactionID index
    exports.updateLastLiveMetricsTimestamp = function(transactionID, lastTimestamp){
        lastLiveMetricsTimestamps[transactionID] = lastTimestamp
    }
    exports.removeLastLiveMetricsTimestamp = function(transactionID){
        delete lastLiveMetricsTimestamps[transactionID]
    }
    exports.getLastLiveMetricsTimestamp = function(transactionID){
        return lastLiveMetricsTimestamps[transactionID]
    }
    exports.lengthLastLiveMetricsTimestamps = function(){
        return Object.keys(lastLiveMetricsTimestamps).length
    }


    //CALLBACKS
    //get callback with some type of id
    /**
     * These functions store actual callbacks. This is because 
     * when an API endpoint is called (start transaction, for example), 
     * the corrosponding ocpp code will eventually be called. When this happens,
     * the server send something to the corrosponding charger (i.e remote start transaction).
     * When this happens, the "trail" for the callback will end there when that
     * specific message is sent. Since we dont want to call the callback 
     * until the message conversation between charger and server is finished, 
     * we store the callback instead, under a uniqueID. Then, when the conversation is finished, 
     * the callback is retrieved and called.
     */
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