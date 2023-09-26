const awilix = require('awilix')
const container = awilix.createContainer()
const config = require('./config')

container.register({

    //Data access layers
    //dataAccessLayerCharger: awilix.asFunction(require('./data-access-layer/charger-repository')),
    // dataAccessLayerReservation: awilix.asFunction(require('./data-access-layer/reservation-repository')),
    // dataAccessLayerTransaction: awilix.asFunction(require('./data-access-layer/transaction-repository')),
    // dataAccessLayerChargePoint: awilix.asFunction(require('./data-access-layer/charge-point-repository')),
    // dataAccessLayerKlarna: awilix.asFunction(require('./data-access-layer/payment-methods/klarna-repository')),
    // New data access layers
    newDataAccessLayerChargeSessions: awilix.asFunction(require('./data-access-layer/new-charge-sessions-repository')),
    newDataAccessLayerCharger: awilix.asFunction(require('./data-access-layer/new-charge-sessions-repository')),
    newDataAccessLayerChargers: awilix.asFunction(require('./data-access-layer/new-chargers-repository')),
    newDataAccessLayerReservations: awilix.asFunction(require('./data-access-layer/new-reservations-repository')),
    newDataAccessLayerTransactions: awilix.asFunction(require('./data-access-layer/new-transactions-repository')),
    newDataAccessLayerChargePoints: awilix.asFunction(require('./data-access-layer/new-charge-points-repository')),
    newDataAccessLayerElectricityTariffs: awilix.asFunction(require('./data-access-layer/new-electricity-tariff-repository')),
    newDataAccessLayerKlarnaPayments: awilix.asFunction(require('./data-access-layer/new-klarna-payments-repository')),
    newDataAccessLayerKlarna: awilix.asFunction(require('./data-access-layer/payment-methods/new-klarna-repository')),
    //Business logic layers
    // databaseInterfaceCharger: awilix.asFunction(require('./database-Interface/database-interface-charger')),
    // databaseInterfaceTransactions: awilix.asFunction(require('./database-Interface/database-interface-transaction')),
    // databaseInterfaceReservations: awilix.asFunction(require('./database-Interface/database-interface-reservations')),
    // databaseInterfaceChargePoint: awilix.asFunction(require('./database-Interface/database-interface-charge-point')),
    // New Business logic layers
    newDatabaseInterfaceChargers: awilix.asFunction(require('./database-Interface/new-database-interface-chargers')),
    newDatabaseInterfaceChargeSessions: awilix.asFunction(require('./database-Interface/new-database-interface-charge-sessions')),
    newDatabaseInterfaceTransactions: awilix.asFunction(require('./database-Interface/new-database-interface-transaction')),
    newDatabaseInterfaceReservations: awilix.asFunction(require('./database-Interface/new-database-interface-reservations')),
    newDatabaseInterfaceChargePoints: awilix.asFunction(require('./database-Interface/new-database-interface-charge-points')),
    newDatabaseInterfaceElectricityTariffs: awilix.asFunction(require('./database-Interface/new-database-interface-electricity-tariff')),
    newDatabaseInterfaceKlarnaPayments: awilix.asFunction(require('./database-Interface/new-database-interface-klarna-payments')),
    databaseInit: awilix.asFunction(require('./data-access-layer/db')),
    databaseInterfaceInvoices: awilix.asFunction(require('./database-Interface/database-interface-invoices')),
    //Database error
    dbErrorCheck: awilix.asFunction(require('./database-Interface/error/database-error-check')),
    //Validation
    // chargerValidation: awilix.asFunction(require("./database-Interface/validation/charger-validation")),
    // transactionValidation: awilix.asFunction(require("./database-Interface/validation/transactionValidation")),
    // reservationValidation: awilix.asFunction(require("./database-Interface/validation/reservationValidation")),
     invoicesValidation: awilix.asFunction(require('./database-Interface/validation/invoices-validation')),
    // chargePointValidation: awilix.asFunction(require("./database-Interface/validation/charge-point-validation")),
    // //New Validation
    newChargerValidation: awilix.asFunction(require("./database-Interface/validation/newChargerValidation")),
    newChargeSessionValidation: awilix.asFunction(require("./database-Interface/validation/newChargeSessionValidation")),
    newChargePointValidation: awilix.asFunction(require("./database-Interface/validation/newChargePointValidation")),
    newTransactionValidation: awilix.asFunction(require("./database-Interface/validation/newTransactionValidation")),
    newReservationValidation: awilix.asFunction(require("./database-Interface/validation/newReservationValidation")),
    newKlarnaPaymentsValidation: awilix.asFunction(require("./database-Interface/validation/newKlarnaPaymentsValidation")),
    //Presentation layers
    chargePointsRouter: awilix.asFunction(require('./presentation-layer/charge-point-router-api')),
    chargersRouter: awilix.asFunction(require('./presentation-layer/chargers-router-api')),
    transactionsRouter: awilix.asFunction(require('./presentation-layer/transactions-router-api')),
    reservationsRouter: awilix.asFunction(require('./presentation-layer/reservations-router-api')),
    authenticationRouter: awilix.asFunction(require('./presentation-layer/authentication-router-api')),
    invoicesRouter: awilix.asFunction(require('./presentation-layer/invoices-router-api')),
    adminRouter: awilix.asFunction(require('./presentation-layer/admin-router-api')),
    testRouter: awilix.asFunction(require('./presentation-layer/test-router-api')),
    errorsMiddleware: awilix.asFunction(require('./presentation-layer/middleware/errors.middleware')),

    //ocpp
    ocpp: awilix.asFunction(require('./xOCPP/server_ocpp')),
    ocppInterface: awilix.asFunction(require('./xOCPP/interface')),
    interfaceHandler: awilix.asFunction(require('./xOCPP/interface_handler')),
    chargerClientHandler: awilix.asFunction(require('./xOCPP/charger_client_handler')),
    chargerMessageHandler: awilix.asFunction(require('./xOCPP/charger_message_handler')),
    constants: awilix.asFunction(require('./xOCPP/constants')),
    broker: awilix.asFunction(require('./xOCPP/broker')),
    userClientHandler: awilix.asFunction(require('./xOCPP/user_client_handler')),
    chargerTests: awilix.asFunction(require('./xOCPP/tests/charger_tests')),
    liveMetricsTests: awilix.asFunction(require('./xOCPP/tests/livemetrics_tests')),
    messageValidations: awilix.asFunction(require('./xOCPP/tests/message_validations')),

    //v is for variables
    v: awilix.asFunction(require('./xOCPP/variables')),
    func: awilix.asFunction(require('./xOCPP/global_functions')),
    tester: awilix.asFunction(require('./xOCPP/tests/tester')),

    app: awilix.asFunction(require('./presentation-layer/app'))
})

const app = container.resolve("app")
const ocpp = container.resolve("ocpp")

ocpp.startServer()


app.listen(config.PORT)
