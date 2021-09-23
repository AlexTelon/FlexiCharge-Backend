const { response } = require('express')
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

    router.get('/userTransactions/:userID', function (request, response) {

    })

    router.get('/chargerTransactions/:chargerID', function (request, response) {
        const chargerId = request.params.chargerID
        databaseInterfaceTransactions.getTransactionsForCharger(chargerId, function (errors, chargerTransaction) {
            if (errors.length == 0 && chargerTransaction.length == 0) {
                response.status(404).end()
            } else if (errors.length == 0) {
                response.status(200).json(chargerTransaction)
            } else {
                response.status(500).json(errors)
            }
        })
    })

    router.post('/', function (request, response) {

        const { userID, chargerID, meterStartValue } = request.body;

        databaseInterfaceTransactions.addTransaction(userID, chargerID, meterStartValue, function (errors, transaction) {
            if (errors.length > 0) {
                response.status(400).json(errors)
            } else if (transaction) {
                response.status(201).json(transaction)
            } else {
                response.status(500).json(errors)
            }
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