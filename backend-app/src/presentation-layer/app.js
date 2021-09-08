const express = require("express")
const app = express()

module.exports = function({ databaseTestPresentation }) {

    app.get('/', (req, res) => {
        res.send('Helloo')
    })

    app.use('/database', databaseTestPresentation)

    return app

}