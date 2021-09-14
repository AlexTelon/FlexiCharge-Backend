const awilix = require('awilix')

const container = awilix.createContainer()

container.register({

    //data access layers
    dataAccessLayerCharger: awilix.asFunction(require('./data-access-layer/charger-repository')),
    dataAccessLayerReservation: awilix.asFunction(require('./data-access-layer/reservation-repository')),
    dataAccessLayerTransaction: awilix.asFunction(require('./data-access-layer/transaction-repository')),

    //business logic layers
    databaseInterfaceCharger: awilix.asFunction(require('./database-Interface/database-interface-charger')),
    databaseInterfaceTransactions: awilix.asFunction(require('./database-Interface/database-interface-transaction')),
    databaseInterfaceReservations: awilix.asFunction(require('./database-Interface/database-interface-reservations')),
    databaseInit: awilix.asFunction(require('./data-access-layer/db')),

    //presentation layers
    databaseTestPresentation: awilix.asFunction(require('./presentation-layer/database-test')), //Remove before production
    chargersRouter: awilix.asFunction(require('./presentation-layer/chargers-router-api')),
    transactionsRouter: awilix.asFunction(require('./presentation-layer/transactions-router-api')),
    reservationsRouter: awilix.asFunction(require('./presentation-layer/reservations-router-api')),

    app: awilix.asFunction(require('./presentation-layer/app'))
})

const app = container.resolve("app")

app.listen(8080)