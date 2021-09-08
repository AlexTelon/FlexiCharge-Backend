var express = require('express')
var router = express.Router()

router.get('/', function (req, res) {
    res.send('Chargers');
})

router.get('/:id', function (req, res) {
    res.send(req.params.id)
})

module.exports = router