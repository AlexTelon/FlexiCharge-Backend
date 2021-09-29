const express = require("express")
const expressHandlebars = require('express-handlebars');
const app = express()
const bodyParser = require('body-parser')

module.exports = function({ chargersRouter, transactionsRouter, reservationsRouter, authenticationRouter, databaseTestRouter }) { //authenticationRouter

    app.set('views', '/backend-app/src/presentation-layer/views')
    app.engine('.hbs', expressHandlebars({ extname: '.hbs' }));
    app.set('view engine', 'hbs')
    app.engine("hbs", expressHandlebars({
        defaultLayout: 'main.hbs'
    }))
    app.use(bodyParser.urlencoded({ extended: false }))
    app.use(bodyParser.json())
    app.use(function(request, response, next) {
        console.log(request.method, request.url);
        next()
    })

    app.get('/', (req, res) => {
        res.render('index.hbs')
    })

    app.use('/chargers', chargersRouter)
    app.use('/transactions', transactionsRouter)
    app.use('/reservations', reservationsRouter)
    app.use('/auth', authenticationRouter)

    app.use('/database', databaseTestRouter)

    return app

}