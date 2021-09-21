var express = require('express')

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

    router.post('/', function (req, res) {
        router.post('/', function (request, response) {
            const chargerID = request.body.chargerID
            const userID = request.body.userID
            const meterStartValue = request.body.MeterStartValue
            databaseInterfaceTransactions.addTransaction(userID, chargerID, meterStartValue, function (errorCodes, transactionId) {
                if (errorCodes.length == 0) {
                    response.status(201).json(transactionId)
                } else {
                    if (errorCodes.includes("internalError") || errorCodes.includes("dbError")) {
                        response.status(500).json(errorCodes)
                    } else {
                        response.status(404).json(errorCodes)
                    }
                }
            })
        })
    })

    router.put(':id', function (req, res) {
        res.send("update transaction with payment")
    })

    router.put(':id', function (req, res) {
        res.send("update transaction with meter")
    })

    return router
}