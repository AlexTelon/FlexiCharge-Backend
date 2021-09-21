var express = require('express')

module.exports = function ({ databaseInterfaceTransactions }) {

    const router = express.Router()

    router.get('/', function (request, response) {
        const transactionId = request.params.id
        databaseInterfaceTransactions.getTransaction(transactionId, function(error, transaction){
            if(errorTransaction.length > 0){
                response.status(500).json(error)
            }else{
                response.status(200).json(transaction)
            }
        })
    })

    router.get('/userTransactions/:userID', function(request, response){
        const userId = request.params.userID
        databaseInterfaceTransactions.getTransactionsForUser(userId, function(errors, userTransaction){
            if(errors.length == 0 && userTransaction.length == 0){
                response.status(404).end()
            }else if(errors.length == 0){
                response.status(200).json(userTransaction)
            }else{
                response.status(500).json(errors)
            }
        })
    })

    router.get('/userTransactions/:chargerID', function(request, response){
        const chargerId = request.params.chargerID
        databaseInterfaceTransactions.getTransactionsForCharger(chargerId, function(errors, chargerTransaction){
            if(errors.length == 0 && chargerTransaction.length == 0){
                response.status(404).end()
            }else if(errors.length == 0){
                response.status(200).json(chargerTransaction)
            }else{
                response.status(500).json(errors)
            }
        })
    })

    router.post('/', function (req, res) {
        res.send("add transactions")
    })

    router.put(':id', function (req, res) {
        res.send("update transaction with payment")
    })

    router.put(':id', function (req, res) {
        res.send("update transaction with meter")
    })

    return router
}