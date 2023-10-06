const awilix = require('awilix')
const container = awilix.createContainer()
const config = require('./config')

container.register({

    //Data access layers
    dataAccessLayerChargeSessions: awilix.asFunction(require('./data-access-layer/charge-sessions-repository')),
    dataAccessLayerChargers: awilix.asFunction(require('./data-access-layer/chargers-repository')),
    dataAccessLayerTransactions: awilix.asFunction(require('./data-access-layer/transactions-repository')),
    dataAccessLayerChargePoints: awilix.asFunction(require('./data-access-layer/charge-points-repository')),
    dataAccessLayerElectricityTariffs: awilix.asFunction(require('./data-access-layer/electricity-tariff-repository')),
    dataAccessLayerKlarnaPayments: awilix.asFunction(require('./data-access-layer/klarna-payments-repository')),
    dataAccessLayerKlarna: awilix.asFunction(require('./data-access-layer/payment-methods/klarna-repository')),
    //Business logic layers
    databaseInterfaceChargers: awilix.asFunction(require('./database-Interface/database-interface-chargers')),
    databaseInterfaceChargeSessions: awilix.asFunction(require('./database-Interface/database-interface-charge-sessions')),
    databaseInterfaceTransactions: awilix.asFunction(require('./database-Interface/database-interface-transaction')),
    databaseInterfaceChargePoints: awilix.asFunction(require('./database-Interface/database-interface-charge-points')),
    databaseInterfaceElectricityTariffs: awilix.asFunction(require('./database-Interface/database-interface-electricity-tariff')),
    databaseInterfaceKlarnaPayments: awilix.asFunction(require('./database-Interface/database-interface-klarna-payments')),
    databaseInit: awilix.asFunction(require('./data-access-layer/db')),
    databaseInterfaceInvoices: awilix.asFunction(require('./database-Interface/database-interface-invoices')),
    //Database error
    dbErrorCheck: awilix.asFunction(require('./database-Interface/error/database-error-check')),
    //Validation
    invoicesValidation: awilix.asFunction(require('./database-Interface/validation/invoices-validation')),
    chargerValidation: awilix.asFunction(require("./database-Interface/validation/charger-validation")),
    chargeSessionValidation: awilix.asFunction(require("./database-Interface/validation/charge-session-validation")),
    chargePointValidation: awilix.asFunction(require("./database-Interface/validation/charge-point-validation")),
    transactionValidation: awilix.asFunction(require("./database-Interface/validation/transaction-validation")),
    klarnaPaymentsValidation: awilix.asFunction(require("./database-Interface/validation/klarna-payments-validation")),
    //Presentation layers
    chargePointsRouter: awilix.asFunction(require('./presentation-layer/charge-point-router-api')),
    chargersRouter: awilix.asFunction(require('./presentation-layer/chargers-router-api')),
    transactionsRouter: awilix.asFunction(require('./presentation-layer/transactions-router-api')),
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
