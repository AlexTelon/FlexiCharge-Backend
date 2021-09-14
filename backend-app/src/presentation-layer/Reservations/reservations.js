var express = require('express')
var router = express.Router()

router.get('/', function (req, res) {
    res.send('Get all reservations')
})

router.get('/user/:userId', function(req, res){
    res.send('Get specific reservation for a user')
})

router.get('/charger/:chargerId', function(req, res){
    res.send('Get specific reservation for a charger')
})

router.post('/', function(req, res){
    res.send('add reservations')
})

router.delete('/:id', function(req,res){
    res.send('delete specific reservation')
})


router.post('/')

module.exports = router