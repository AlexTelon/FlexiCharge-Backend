

module.exports = function({ v, func, appMessageHandler, constants, databaseInterfaceTransactions, dbInterfaceTransactionsMock}){

    exports.handleClient = function(appClientSocket, transactionID){
        let messageCache = ""
        
        validateTransaction(transactionID, function(errors, transaction){
            if(errors.length || !transaction){
                errorMessage = 'validateClient: transaction was not found in DB'
                console.log(errorMessage)
                console.log(errors)
                appClientSocket.send(errorMessage)
                appClientSocket.terminate()
                return
            }

            v.addConnectedAppSockets(transactionID, appClientSocket)
            v.addAppTransactionID(transactionID)

            console.log('App client socket connected with transactionID: ' + transactionID)
            console.log('Number of connected app sockets: ' + v.getLengthConnectedAppSockets())

            if(messageCache){
                appMessageHandler.handleMessage(messageCache, appClientSocket, transactionID)
            }
        })

        appClientSocket.on('message', function incoming(message){
            console.log(message) //TODO: Handle message, messageCache if not yet validated?
            if(v.isInAppTransactionIDs(transactionID)){
                appMessageHandler.handleMessage(message, appClientSocket, transactionID)
            } else {
                messageCache = message
            }
        })

    }

    function validateTransaction(transactionID, callback) {
        if(transactionID == ""){
            const errorMessage = 'badTransactionID' // TODO: Should we have an dedicated file with error codes?
            callback([errorMessage], null)
            return
        }

        // dbInterfaceTransactionsMock.getTransaction(transactionID, function(errors, transaction){ /** FOR INTERNAL TESTING ONLY */
        databaseInterfaceTransactions.getTransaction(transactionID, function(errors, transaction){ /** PRODUCTION CODE */
            if(errors.length || !transaction){
                console.log(errors)
                callback(errors, null)
            } else {
                console.log(transaction)
                console.log(errors)

                callback([], transaction) //Should we check userID instead, and add that to variables aswell?
            }
        })
        
    }

    return exports

}