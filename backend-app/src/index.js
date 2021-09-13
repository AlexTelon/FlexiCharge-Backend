const awilix = require('awilix')

const container = awilix.createContainer()

container.register({
    dataAccessLayerDatabase: awilix.asFunction(require('./data-access-layer/data-access-database')),
    businessLogicDatabase: awilix.asFunction(require('./business-logic-layer/business-logic-database')),
    databaseTestPresentation: awilix.asFunction(require('./presentation-layer/database-test')),

    authenticationRouter: awilix.asFunction(require('./presentation-layer/authentication-router-api')),
    transactionsRouter: awilix.asFunction(require('./presentation-layer/transactions-router-api')),
    reservationsRouter: awilix.asFunction(require('./presentation-layer/reservations-router-api')),
    chargersRouter: awilix.asFunction(require('./presentation-layer/chargers-router-api')),

    verifyTokenExample: awilix.asFunction(require('./presentation-layer/verify_token_example-router-api')),

    app: awilix.asFunction(require('./presentation-layer/app'))
})

const app = container.resolve("app")

app.listen(8080)