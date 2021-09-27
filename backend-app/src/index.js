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
    databaseInterfaceChargerPoint: awilix.asFunction(require('./database-Interface/database-interface-chargerpoint')),
    databaseInit: awilix.asFunction(require('./data-access-layer/db')),
    //Database error
    dbErrorCheck: awilix.asFunction(require('./database-Interface/error/database-error-check')),
    //Validation
    chargerValidation: awilix.asFunction(require("./database-Interface/validation/chargerValidation")),
    transactionValidation: awilix.asFunction(require("./database-Interface/validation/transactionValidation")),
    reservationValidation: awilix.asFunction(require("./database-Interface/validation/reservationValidation")),

    //presentation layers
    chargersRouter: awilix.asFunction(require('./presentation-layer/chargers-router-api')),
    transactionsRouter: awilix.asFunction(require('./presentation-layer/transactions-router-api')),
    reservationsRouter: awilix.asFunction(require('./presentation-layer/reservations-router-api')),
    authenticationRouter: awilix.asFunction(require('./presentation-layer/authentication-router-api')),

    databaseTestRouter: awilix.asFunction(require('./presentation-layer/database-test')), //Remove for production
    
    //ocpp
    ocpp: awilix.asFunction(require('./xOCPP/server_ocpp')),


    app: awilix.asFunction(require('./presentation-layer/app'))
})

const app = container.resolve("app")
const ocpp = container.resolve("ocpp")

ocpp.startServer()

app.listen(8080)