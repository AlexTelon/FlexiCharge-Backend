const express = require("express")
const app = express()
const chargers = require('./Chargers/chargers')
const transactions = require('./Transactions/transactions')
const reservations = require('./Reservations/reservations')

module.exports = function ({ databaseTestPresentation }) {

    app.get('/', (req, res) => {
        res.send('Helloo')
    })

    app.use('/chargers', chargers)
    app.use('/transactions', transactions)
    app.use('/reservations', reservations)

    app.use('/database', databaseTestPresentation)

    return app

}