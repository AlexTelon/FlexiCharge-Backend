const express = require("express")
const app = express()
const bodyParser = require('body-parser')

const chargers = require('./Chargers/chargers')
const transactions = require('./Transactions/transactions')
const reservations = require('./Reservations/reservations')
const auth = require('./Auth/auth.js')

module.exports = function ({ databaseTestPresentation }) {


    app.use(bodyParser.urlencoded({ extended: false }))
    app.use(bodyParser.json())

    app.get('/', (req, res) => {
        res.send('Helloo')
    })

    app.use('/chargers', chargers)
    app.use('/transactions', transactions)
    app.use('/reservations', reservations)
    app.use('/auth', auth)

    app.use('/database', databaseTestPresentation)

    return app

}