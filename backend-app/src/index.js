const awilix = require('awilix')
const container = awilix.createContainer()
const config = require('./config')

container.register({

    //Data access layers
    dataAccessLayerCharger: awilix.asFunction(require('./data-access-layer/charger-repository')),
    dataAccessLayerReservation: awilix.asFunction(require('./data-access-layer/reservation-repository')),
    dataAccessLayerTransaction: awilix.asFunction(require('./data-access-layer/transaction-repository')),
    dataAccessLayerChargePoint: awilix.asFunction(require('./data-access-layer/charge-point-repository')),
    dataAccessLayerKlarna: awilix.asFunction(require('./data-access-layer/payment-methods/klarna-repository')),
    // New data access layers
    newDataAccessLayerChargeSessions: awilix.asFunction(require('./data-access-layer/new-charge-sessions-repository')),
    newDataAccessLayerChargers: awilix.asFunction(require('./data-access-layer/new-chargers-repository')),
    newDataAccessLayerReservations: awilix.asFunction(require('./data-access-layer/new-reservations-repository')),
    newDataAccessLayerTransactions: awilix.asFunction(require('./data-access-layer/new-transactions-repository')),
    newDataAccessLayerChargePoints: awilix.asFunction(require('./data-access-layer/new-charge-points-repository')),
    newDataAccessLayerElectricityTariffs: awilix.asFunction(require('./data-access-layer/new-electricity-tariff-repository')),
    //Business logic layers
    databaseInterfaceCharger: awilix.asFunction(require('./database-Interface/database-interface-charger')),
    databaseInterfaceTransactions: awilix.asFunction(require('./database-Interface/database-interface-transaction')),
    databaseInterfaceReservations: awilix.asFunction(require('./database-Interface/database-interface-reservations')),
    databaseInterfaceChargePoint: awilix.asFunction(require('./database-Interface/database-interface-charge-point')),
    // New Business logic layers
    newDatabaseInterfaceChargers: awilix.asFunction(require('./database-Interface/new-database-interface-chargers')),
    newDatabaseInterfaceChargeSessions: awilix.asFunction(require('./database-Interface/new-database-interface-charge-sessions')),
    newDatabaseInterfaceTransactions: awilix.asFunction(require('./database-Interface/new-database-interface-transaction')),
    newDatabaseInterfaceReservations: awilix.asFunction(require('./database-Interface/new-database-interface-reservations')),
    newDatabaseInterfaceChargePoints: awilix.asFunction(require('./database-Interface/new-database-interface-charge-points')),
    newDatabaseInterfaceElectricityTariffs: awilix.asFunction(require('./database-Interface/new-database-interface-electricity-tariff')),
    databaseInit: awilix.asFunction(require('./data-access-layer/db')),
    // Business logic tests
    interfaceChargeSessionsTests: awilix.asFunction(require('./database-Interface/tests/database-interface-charge-sessions.test')),
    interfaceChargersTests: awilix.asFunction(require('./database-Interface/tests/database-interface-chargers.test')),
    interfaceChargePointsTests: awilix.asFunction(require('./database-Interface/tests/database-interface-charge-points.test')),


    interfaceElectricityTariffsTests: awilix.asFunction(require('./database-Interface/tests/database-interface-electricity-tariffs.test')),
    //Database error
    dbErrorCheck: awilix.asFunction(require('./database-Interface/error/database-error-check')),

    //Validation
    chargerValidation: awilix.asFunction(require("./database-Interface/validation/chargerValidation")),
    transactionValidation: awilix.asFunction(require("./database-Interface/validation/transactionValidation")),
    reservationValidation: awilix.asFunction(require("./database-Interface/validation/reservationValidation")),
    chargePointValidation: awilix.asFunction(require("./database-Interface/validation/chargePointValidation")),
    //New Validation
    newChargerValidation: awilix.asFunction(require("./database-Interface/validation/newChargerValidation")),
    newChargeSessionValidation: awilix.asFunction(require("./database-Interface/validation/newChargeSessionValidation")),
    newChargePointValidation: awilix.asFunction(require("./database-Interface/validation/newChargePointValidation")),
    newTransactionValidation: awilix.asFunction(require("./database-Interface/validation/newTransactionValidation")),
    newReservationValidation: awilix.asFunction(require("./database-Interface/validation/newReservationValidation")),
    //Presentation layers
    chargePointsRouter: awilix.asFunction(require('./presentation-layer/charge-point-router-api')),
    chargersRouter: awilix.asFunction(require('./presentation-layer/chargers-router-api')),
    transactionsRouter: awilix.asFunction(require('./presentation-layer/transactions-router-api')),
    reservationsRouter: awilix.asFunction(require('./presentation-layer/reservations-router-api')),
    authenticationRouter: awilix.asFunction(require('./presentation-layer/authentication-router-api')),
    adminRouter: awilix.asFunction(require('./presentation-layer/admin-router-api')),

    //ocpp
    ocpp: awilix.asFunction(require('./xOCPP/server_ocpp')),
    ocppInterface: awilix.asFunction(require('./xOCPP/interface')),
    interfaceHandler: awilix.asFunction(require('./xOCPP/interface_handler')),
    clientHandler: awilix.asFunction(require('./xOCPP/client_handler')),
    messageHandler: awilix.asFunction(require('./xOCPP/message_handler')),
    constants: awilix.asFunction(require('./xOCPP/constants')),
    //v is for variables
    v: awilix.asFunction(require('./xOCPP/variables')),
    func: awilix.asFunction(require('./xOCPP/global_functions')),
    test: awilix.asFunction(require('./xOCPP/test')),

    app: awilix.asFunction(require('./presentation-layer/app'))
})

const app = container.resolve("app")
const ocpp = container.resolve("ocpp")

ocpp.startServer()


app.listen(config.PORT)