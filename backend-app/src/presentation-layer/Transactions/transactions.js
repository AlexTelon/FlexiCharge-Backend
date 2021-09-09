var express = require('express')
var router = express.Router()

router.get('/', function (req, res) {
    res.send('Transactions')
})

router.post('/', function(req, res){
    res.send("add transactions")
})


router.put(':id', function(req,res){
    res.send("update transaction with id")
})
module.exports = router