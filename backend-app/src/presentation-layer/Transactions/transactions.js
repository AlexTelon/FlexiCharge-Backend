var express = require('express')
var router = express.Router()

router.get('/', function (req, res) {
    res.send('Transactions')
})

router.get('/user/:userId', function(req,res){
    res.send('retrieves all transactions for a user')
})

router.get('/charger/:chargerId', function(req,res){
    res.send('retrieves all transactions for a charger')
})

router.post('/', function(req, res){
    res.send("add transaction")
})

router.put('/:id', function(req,res){
    res.send("stop transaction with id")
})

module.exports = router