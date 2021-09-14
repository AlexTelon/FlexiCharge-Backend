const express = require("express")
const app = express()
const bodyParser = require('body-parser')

const auth = require('./Auth/auth.js')

module.exports = function ({ databaseTestPresentation }) {
    console.log("Starting app")

    app.use(bodyParser.urlencoded({ extended: false }))
    app.use(bodyParser.json())

    app.get('/', (req, res) => {
        res.send('Helloo')
    })

    app.use('/auth', auth)

    app.use('/database', databaseTestPresentation)

    return app

}