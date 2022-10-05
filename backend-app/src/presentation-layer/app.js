const express = require("express")
const expressHandlebars = require('express-handlebars');
const app = express()
const bodyParser = require('body-parser');
const swaggerUi = require('swagger-ui-express')
const path = require('path')
const yaml = require('yamljs')
const openApiDocument = yaml.load(path.join(__dirname, '../../docs/openapi.yaml'))

module.exports = function({ chargersRouter, transactionsRouter, reservationsRouter, authenticationRouter, adminRouter, chargePointsRouter, invoicesRouter, ocppInterface }) { //authenticationRouter

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

        response.setHeader("Access-Control-Allow-Origin", "*") // "localhost:3000"
        response.setHeader("Access-Control-Allow-Methods", "*") // GET, POST, PUT, DELETE
        response.setHeader("Access-Control-Allow-Headers", "*")
        response.setHeader("Access-Control-Expose-Headers", "*")

        next()
    })
    
    app.get('/', (req, res) => {
        res.redirect('/swagger')
    })

    app.use('/swagger', swaggerUi.serve, swaggerUi.setup(openApiDocument));
    app.use('/chargers', chargersRouter)
    app.use('/transactions', transactionsRouter)
    app.use('/reservations', reservationsRouter)
    app.use('/chargePoints', chargePointsRouter)
    app.use('/auth', authenticationRouter)
    app.use('/admin', adminRouter)
    app.use('/invoices', invoicesRouter)

    return app
}