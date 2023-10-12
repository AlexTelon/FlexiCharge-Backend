const awilix = require("awilix");

function chargePointRepositoryMock() {
    const defaultItem = {
        chargePointID: 1,
        name: "Coop, Forserum",
        address: "Värnamovägen",
        location: [57.70022044183724, 14.475150415104222]
    }

    return {
        getChargePoint: function (chargePointID, callback) {
            callback([], {
                chargePointID,
                ...defaultItem
            })
        },
        getChargePoints: function (callback) {
            callback([], [defaultItem])
        },
        addChargePoint: function (name, address, location, callback) {
            callback([], {
                chargePointID: 2,
                name,
                address,
                location
            })
        },
        removeChargePoint: function (chargePointID, callback) {
            callback([], true)
        },
        updateChargePoint: function (chargePointID, name, location, address, callback) {
            callback([], {
                chargePointID,
                name,
                location,
                address
            })
        }
    }
}

function chargeSessionsRepositoryMock() {
    const defaultItem = {
        chargeSessionID: 1,
        userID: 1,
        connectorID: 100001,
        kWhTransferred: 1000,
        currentChargePercentage: 100,
        meterStart: 100,
        startTime: null,
        endTime: null
    }

    return {
        addChargeSession: function (connectorID, userID, startTime, callback) {
            callback([], {
                chargeSessionID: 2,
                connectorID,
                userID,
                startTime
            })
        },
        getChargeSession: function (chargeSessionID, callback) {
            callback([], { ...defaultItem, chargeSessionID })
        },
        getChargeSessions: function (connectorID, callback) {
            callback([], [defaultItem])
        },
        updateChargeSession: function (chargeSessionID, updatedProperties, callback) {
            callback([], {
                chargeSessionID,
                ...updatedProperties
            })
        },
        updateChargingEndTime: function (chargeSessionID, endTime, callback) {
            callback([], {
                ...defaultItem,
                chargeSessionID,
                endTime,
            })
        },
        updateChargingState: function (chargeSessionID, currentChargePercentage, kWhTransferred, callback) {
            callback([], {
                ...defaultItem,
                chargeSessionID,
                currentChargePercentage,
                kWhTransferred
            })
        },
        updateMeterStart: function (chargeSessionID, meterStart, callback) {
            callback([], {
                ...defaultItem,
                chargeSessionID,
                meterStart
            })
        },
    }
}

function chargersRepositoryMock() {
    const defaultItem = {
        connectorID: 100000,
        location: [57.749812214261034, 14.070100435207065],
        serialNumber: "abc123",
        status: 'Available'
    }

    return {
        getChargers: function (callback) {
            callback([], [defaultItem])
        },
        getCharger: function (connectorID, callback) {
            callback([], {
                ...defaultItem,
                connectorID
            })
        },
        getChargerBySerialNumber: function (serialNumber, callback) {
            callback([], {
                ...defaultItem,
                serialNumber
            })
        },
        getAvailableChargers: function (callback) {
            callback([], [defaultItem])
        },
        addCharger: function (chargePointID, serialNumber, location, callback) {
            const newCharger = {
                connectorID: 2,
                chargePointID,
                serialNumber,
                location,
            }

            callback([], newCharger)
        },
        removeCharger: function (connectorID, callback) {
            callback([], true)
        },
        updateChargerStatus: function (connectorID, status, callback) {
            callback([], {
                ...defaultItem,
                connectorID,
                status
            })
        },
    }
}

function transactionsRepositoryMock() {
    const defaultItem = {
        transactionID: 1,
        userID: 1,
        paymentMethod: "Klarna",
        isPaid: null,
        payNow: false,
        transactionDate: null,
        paymentDueDate: null,
        paidDate: null,
        totalPrice: 13.37,
        chargeSessionID: null
    }

    return {
        addTransaction: function(chargeSessionID, userID, payNow, paymentDueDate, paymentMethod, totalPrice, callback) {
            callback([], {
                ...defaultItem,
                chargeSessionID,
                userID,
                payNow,
                paymentDueDate,
                paymentMethod,
                totalPrice
            })
        },
        getTransaction: function (transactionID, callback) {
            callback([], { ...defaultItem, transactionID })
        },
        getTransactionsForUser: function (userID, callback) {
            callback([], [defaultItem])
        },
        updatePaymentMethod: function (transactionID, paymentMethod, callback) {
            callback([], {
                ...defaultItem,
                transactionID,
                paymentMethod
            })
        },
        updateisPaid: function (transactionID, isPaid, callback) {
            callback([], {
                ...defaultItem,
                transactionID,
                isPaid
            })
        },
        updatepaidDate: function (transactionID, paidDate, callback) {
            callback([], {
                ...defaultItem,
                transactionID,
                paidDate
            })
        },
        updateTotalPrice: function (transactionID, totalPrice, callback) {
            callback([], {
                ...defaultItem,
                transactionID,
                totalPrice
            })
        },
        getTransactionForChargeSession: function (chargeSessionID, callback) {
            callback([], {
                ...defaultItem,
                chargeSessionID
            })
        },
        getTransactionsForCharger: function( connectorID, callback) {
            callback([], [{
                ...defaultItem,
                connectorID
            }])
        }
    }
}

function electricityTarriffRepositoryMock() {
    const dateToday = new Date(new Date())

    const defaultItem = {
        date: dateToday.toISOString(),
        price: 3.51,
        currency: "SEK"
    }

    return {
        addElectricityTariff: function (date, price, currency, callback) {
            callback([], {
                date,
                price,
                currency
            })
        },
        getElectricityTariffByDate: function (date, callback) {
            callback([], {
                ...defaultItem,
                date
            })
        },
        getElectricityTariffsOrderByDate: function (callback) {
            callback([], [defaultItem])
        },
            removeElectricityTariff: function (date, callback) {
            callback([], true)
        },
    }
}

function klarnaPaymentsRepositoryMock() {
    const defaultItem = {
        klarnaPaymentID: 1,
        transactionID : 1,
        order_id: "a35az35g_46sfh3_547sdfg",
        client_token: "a34657dh54#4ts47",
        session_id: "47mlkdfmt232m5l",
    }

    return {
        getKlarnaPaymentByTransactionID : function (transactionID, callback) {
            callback([], {...defaultItem, transactionID})
        },
        addKlarnaPayment : function (client_token, session_id, transactionID, callback) {
            callback([], {
                klarnaPaymentID : 2,
                client_token,
                session_id,
                transactionID
            })
        },
        updateOrderID : function (transactionID, order_id, callback) {
            callback([], {
                ...defaultItem,
                order_id,
                transactionID
            })
        },
    }
}

function ocppInterfaceMock() {
    return {
        remoteStartTransaction: function(connectorID, transactionID, callback) {
            callback(null, {
                meterStart: 1032
            })
        },
        remoteStopTransaction: function(connectorID, transactionID, callback) {
            callback(null, {
                meterStop: 2000
            })
        }
    }
}

function klarnaRepositoryMock() {
    return {
        getNewKlarnaPaymentSession: function(totalPrice, callback) {
            callback([], {
                session_id : "fake_session_id",
                client_token : "fake_client_token"
            })
        },
        createKlarnaOrder: function(totalPrice, authorization_token, callback) {
            callback([], {
                order_id: "fake_order_id"
            })
        },
        finalizeKlarnaOrder: function(totalPrice, order_id, callback) {
            callback([], [])
        }
    }
}

const testContainer = awilix.createContainer()
testContainer.register({
    // DAL
    dataAccessLayerChargePoints: awilix.asFunction(chargePointRepositoryMock),
    dataAccessLayerChargeSessions: awilix.asFunction(chargeSessionsRepositoryMock),
    dataAccessLayerChargers: awilix.asFunction(chargersRepositoryMock),
    dataAccessLayerTransactions: awilix.asFunction(transactionsRepositoryMock),
    dataAccessLayerElectricityTariffs: awilix.asFunction(electricityTarriffRepositoryMock),
    dataAccessLayerKlarnaPayments: awilix.asFunction(klarnaPaymentsRepositoryMock),
    dataAccessLayerKlarna: awilix.asFunction(klarnaRepositoryMock),

    // BLL
    databaseInterfaceChargers: awilix.asFunction(require('./database-Interface/database-interface-chargers')),
    databaseInterfaceChargeSessions: awilix.asFunction(require('./database-Interface/database-interface-charge-sessions')),
    databaseInterfaceTransactions: awilix.asFunction(require('./database-Interface/database-interface-transaction')),
    databaseInterfaceChargePoints: awilix.asFunction(require('./database-Interface/database-interface-charge-points')),
    databaseInterfaceElectricityTariffs: awilix.asFunction(require('./database-Interface/database-interface-electricity-tariff')),
    databaseInterfaceKlarnaPayments: awilix.asFunction(require('./database-Interface/database-interface-klarna-payments')),
    // databaseInterfaceInvoices: awilix.asFunction(require('./database-Interface/database-interface-invoices')),

    // Validation
    chargerValidation: awilix.asFunction(require("./database-Interface/validation/charger-validation")),
    chargeSessionValidation: awilix.asFunction(require("./database-Interface/validation/charge-session-validation")),
    chargePointValidation: awilix.asFunction(require("./database-Interface/validation/charge-point-validation")),
    transactionValidation: awilix.asFunction(require("./database-Interface/validation/transaction-validation")),
    klarnaPaymentsValidation: awilix.asFunction(require("./database-Interface/validation/klarna-payments-validation")),
    // OCPP
    ocppInterface: awilix.asFunction(ocppInterfaceMock),

    dbErrorCheck: awilix.asFunction(require('./database-Interface/error/database-error-check')),
})

module.exports = testContainer
