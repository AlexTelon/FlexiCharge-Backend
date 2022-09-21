

module.exports = function({ v, func, appMessageHandler, constants, databaseInterfaceTransactions, dbInterfaceTransactionsMock}){

    exports.handleClient = function(clientSocket, transactionID){
        let messageCache = ""
        validateClient(clientSocket, transactionID, function(errors, dbTransactionID){
            if(errors.length || !dbTransactionID){
                errorMessage = 'validateClient: transactionID was not found in DB'
                console.log(errorMessage)
                console.log(errors)
                clientSocket.send(errorMessage)
                clientSocket.terminate()
                return
            }
            
            v.addConnectedAppSockets(dbTransactionID, clientSocket)
            v.addAppTransactionID(dbTransactionID)

            console.log('App client socket connected with transactionID: ' + dbTransactionID)
            console.log('Number of connected app sockets: ' + v.getLengthConnectedAppSockets())

            if(messageCache){
                appMessageHandler.handleMessage(messageCache, clientSocket, transactionID)
            }
            
        })

        clientSocket.on('message', function incoming(message){
            console.log(message) //TODO: Handle message, messageCache if not yet validated?
            if(v.isInAppTransactionIDs(transactionID)){
                appMessageHandler.handleMessage(message, clientSocket, transactionID)
            } else {
                messageCache = message
            }
        })

    }

    function validateClient(clientSocket, transactionID, callback) {
        if(transactionID == ""){
            const errorMessage = 'badTransactionID' // TODO: Should we have an dedicated file with error codes?
            callback([errorMessage], null)
            return
        }

        // dbInterfaceTransactionsMock.getTransaction(transactionID, function(errors, transaction){ /** FOR INTERNAL TESTING ONLY */
        databaseInterfaceTransactions.getTransaction(transactionID, function(errors, transaction){ /** PRODUCTION CODE */
            if(errors.length || !Number.isInteger(transaction.transactionID)){
                console.log(errors)
                callback(errors, null)
            } else {
                console.log(transaction.transactionID)
                console.log(errors)

                callback([], transaction.transactionID) //Should we check userID instead, and add that to variables aswell?
            }
        })
        
    }

    return exports

}