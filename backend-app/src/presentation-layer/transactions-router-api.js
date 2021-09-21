var express = require('express')

module.exports = function ({ databaseInterfaceTransactions }) {

    const router = express.Router()

    router.get('/', function (req, res) {
        const id = req.params.id
        databaseInterfaceTransactions.getTransaction(id, function(error, transaction){
            if(errorTransaction.length > 0){
                res.status(500).json(error)
            }else{
                res.status(200).json(transaction)
            }
        })
    })

    router.post('/', function (req, res) {
        res.send("add transactions")
    })

    router.put(':id', function (req, res) {
        res.send("update transaction with id")
    })

    return router
}