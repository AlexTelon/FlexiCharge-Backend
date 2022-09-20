

module.exports = function({  }){

    exports.getTransaction = function(transactionID, callback){
        const transaction = {
            //TODO: add some mock transaction data here
            transactionID: 1
        }
        callback([], transaction)
    }

    return exports
}