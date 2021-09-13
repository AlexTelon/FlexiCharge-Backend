var express = require('express')
var router = express.Router()

router.get('/', function (req, res) {
    res.send('Get all reservations')
})

router.get('/:userId', function(req, res){
    res.send('Get specific reservation')
})

router.get('/:chargerId', function(req, res){
    res.send('Get specific reservation')
})

router.post('/', function(req, res){
    res.send('add reservations')
})

router.delete('/:id', function(req,res){
    res.send('delete specific reservation')
})


router.post('/')

module.exports = router