const awilix = require("awilix");

function chargePointRepositoryMock() {
    const defaultChargePoint = {
        chargePointID : 1,
        name : "Coop, Forserum",
        address : "Värnamovägen",
        coordinates : [57.70022044183724,14.475150415104222]
    }

    return {
        getChargePoint: function(id, callback) {
            const returnedChargePoint = defaultChargePoint
            returnedChargePoint.id = id
            callback([], returnedChargePoint)
        }
    }
}

const testContainer = awilix.createContainer()
testContainer.register({
    // DAL
    newDataAccessLayerChargePoints: awilix.asFunction(chargePointRepositoryMock),
    newDataAccessLayerChargeSessions: "Should be mocked",
    newDataAccessLayerChargers: "Should be mocked",
    newDataAccessLayerReservations: "Should be mocked",
    newDataAccessLayerTransactions: "Should be mocked",
    newDataAccessLayerChargePoints: "Should be mocked",
    newDataAccessLayerElectricityTariffs: "Should be mocked",
    newDataAccessLayerKlarnaPayments: "Should be mocked",
    newDataAccessLayerKlarna: "Should be mocked",

    // BLL
    newDatabaseInterfaceChargers: awilix.asFunction(require('./database-Interface/new-database-interface-chargers')),
    newDatabaseInterfaceChargeSessions: awilix.asFunction(require('./database-Interface/new-database-interface-charge-sessions')),
    newDatabaseInterfaceTransactions: awilix.asFunction(require('./database-Interface/new-database-interface-transaction')),
    newDatabaseInterfaceReservations: awilix.asFunction(require('./database-Interface/new-database-interface-reservations')),
    newDatabaseInterfaceChargePoints: awilix.asFunction(require('./database-Interface/new-database-interface-charge-points')),
    newDatabaseInterfaceElectricityTariffs: awilix.asFunction(require('./database-Interface/new-database-interface-electricity-tariff')),
    newDatabaseInterfaceKlarnaPayments : awilix.asFunction(require('./database-Interface/new-database-interface-klarna-payments')),
    databaseInterfaceInvoices: awilix.asFunction(require('./database-Interface/database-interface-invoices')),

    // Validation
    newChargerValidation: awilix.asFunction(require("./database-Interface/validation/newChargerValidation")),
    newChargeSessionValidation: awilix.asFunction(require("./database-Interface/validation/newChargeSessionValidation")),
    newChargePointValidation: awilix.asFunction(require("./database-Interface/validation/newChargePointValidation")),
    newTransactionValidation: awilix.asFunction(require("./database-Interface/validation/newTransactionValidation")),
    newReservationValidation: awilix.asFunction(require("./database-Interface/validation/newReservationValidation")),

    // OCPP
    ocppInterface: "Should be mocked",

    dbErrorCheck: awilix.asFunction(require('./database-Interface/error/database-error-check')),    
})

module.exports = testContainer