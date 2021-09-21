const express = require("express")
const app = express()
const bodyParser = require('body-parser')

<<<<<<< HEAD
module.exports = function ({ chargersRouter, transactionsRouter, reservationsRouter, authenticationRouter, adminRouter }) { //authenticationRouter
=======
module.exports = function ({ chargersRouter, transactionsRouter, reservationsRouter, authenticationRouter, databaseTestRouter }) { //authenticationRouter
>>>>>>> origin/db_branch

    app.use(bodyParser.urlencoded({ extended: false }))
    app.use(bodyParser.json())
    app.use(function (request, response, next) {
        console.log(request.method, request.url);

        // response.setHeader("Access-Control-Allow-Origin", "*") // "localhost:3000"
        // response.setHeader("Access-Control-Allow-Methods", "*") // GET, POST, PUT, DELETE
        // response.setHeader("Access-Control-Allow-Headers", "*")
        // response.setHeader("Access-Control-Expose-Headers", "*")

        next()
    })

    app.get('/', (req, res) => {
        res.send('Helloo')
    })

    app.use('/chargers', chargersRouter)
    app.use('/transactions', transactionsRouter)
    app.use('/reservations', reservationsRouter)
    app.use('/auth', authenticationRouter)
<<<<<<< HEAD
    app.use('/auth/admin', adminRouter)
=======
    
    app.use('/database', databaseTestRouter)
>>>>>>> origin/db_branch

    return app

}
