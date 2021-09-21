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
    dbErrorCheck: awilix.asFunction(require('./database-Interface/database-error-check')),

    //presentation layers
    chargersRouter: awilix.asFunction(require('./presentation-layer/chargers-router-api')),
    transactionsRouter: awilix.asFunction(require('./presentation-layer/transactions-router-api')),
    reservationsRouter: awilix.asFunction(require('./presentation-layer/reservations-router-api')),
    authenticationRouter: awilix.asFunction(require('./presentation-layer/authentication-router-api')),
<<<<<<< HEAD
    adminRouter: awilix.asFunction(require('./presentation-layer/admin-router-api')),
=======

    databaseTestRouter: awilix.asFunction(require('./presentation-layer/database-test')), //Remove for production
    
    //ocpp
    ocpp: awilix.asFunction(require('./xOCPP/server_ocpp')),
>>>>>>> origin/db_branch

    ocpp: awilix.asFunction(require('./xOCPP/server_ocpp')),

    app: awilix.asFunction(require('./presentation-layer/app'))
})

const app = container.resolve("app")
const ocpp = container.resolve("ocpp")

ocpp.startServer()

app.listen(8080)