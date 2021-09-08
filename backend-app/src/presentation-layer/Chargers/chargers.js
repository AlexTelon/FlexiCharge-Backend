var express = require('express')
var router = express.Router()

router.get('/', function (req, res) {
    res.send('Chargers');
})

router.get('/:id', function (req, res) {
    res.send(req.params.id)
})

//Don´t quite understand this one below, but it is for returning all of the available chargers, ignore it for now
router.get('/', function(req, res){ 
    res.send('return all available chargers');
})

router.post('/', function(req, res){
    res.send("add charger")
})

router.delete('/:id', function(req, res){
    res.send("delete charger")
})

router.put('/:id', function(req,res){
    res.send("update charger with id")
})

module.exports = router