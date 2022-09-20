

module.exports = function({ v, func, appMessageHandler, constants, databaseInterfaceTransactions}){

    exports.handleClient = function(clientSocket, transactionID){
        validateClient(clientSocket, transactionID, function(errors, transactionID){
            if(errors.length){
                errorMessage = 'validateClient: transactionID was not found in DB'
                console.log(errorMessage)
                clientSocket.send(errorMessage)
                clientSocket.terminate()
                return
            }

            console.log('App client socket connected with transactionID:' + transactionID)
            console.log('Number of connected app sockets: ' + v.getLengthConnectedAppSockets())

            v.addConnectedAppSocket(transactionID, clientSocket)
            v.addAppTransactionID(transactionID)
            
        })

        clientSocket.on('message', function incoming(message){
            console.log(message) //TODO: Handle message, messageCache if not yet validated?
        })

    }

    function validateClient(clientSocket, transactionID, callback) {
        if(transactionID == ""){
            const errorMessage = 'badTransactionID' // TODO: Should we have an dedicated file with error codes?
            callback([errorMessage], null)
            return
        }

        /********** FOR INTERNAL TESTING, REMOVE BEFORE PRODUCTION *********/
        //dbInterfaceTransactionsMock.getTransaction(transactionID, function(error, transaction){
        /*******************************************************************/
        
        databaseInterfaceTransactions.getTransaction(transactionID, function(error, transaction){
            if(error){
                console.log(error)
                callback([error], null)
            } else{
                callback([], transaction.transactionID) //Should we check userID instead, and add that to variables aswell?
            }
        })
        
    }

    return exports

}