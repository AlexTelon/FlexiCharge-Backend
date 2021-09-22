var express = require('express')
const AuthMiddleware = require('./middleware/auth.middleware')
const authMiddleware = new AuthMiddleware()

module.exports = function ({ databaseInterfaceTransactions }) {

    const router = express.Router()

    router.get('/:id', function (request, response) {
        const transactionId = request.params.id
        databaseInterfaceTransactions.getTransaction(transactionId, function (errors, transaction) {
            if (errors.length == 0 && transaction.length == 0) {
                response.status(404).end()
            } else if (errors.length == 0) {
                response.status(200).json(transaction)
            } else {
                response.status(500).json(errors)
            }
        })
    })

    router.get('/userTransactions/:userID', function(request, response){
        
    })

    router.get('/chargerTransactions/:chargerID', function(request, response){
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

    
    router.post('/', function (request, response) {
        
    })
    

    router.put(':id', function (req, res) {
        res.send("update transaction with payment")
    })

    router.put(':id', function (req, res) {
        res.send("update transaction with meter")
    })

    return router
}