const awilix = require("awilix");

function chargePointRepositoryMock() {
    const defaultItem = {
        chargePointID: 1,
        name: "Coop, Forserum",
        address: "Värnamovägen",
        coordinates: [57.70022044183724, 14.475150415104222]
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
        addChargePoint: function (name, address, coordinates, callback) {
            callback([], {
                chargePointID: 2,
                name,
                address,
                coordinates
            })
        },
        removeChargePoint: function (chargePointID, callback) {
            callback([], true)
        },
        updateChargePoint: function (chargePointID, name, coordinates, address, callback) {
            callback([], {
                chargePointID,
                name,
                coordinates,
                address
            })
        }
    }
}

function chargeSessionsRepositoryMock() {
    const defaultItem = {
        chargeSessionID: 1,
        userID: 1,
        chargerID: 100001,
        kWhTransferred: 1000,
        currentChargePercentage: 100,
        meterStart: 100,
        startTime: null,
        endTime: null
    }

    return {
        addChargeSession: function (chargerID, userID, startTime, callback) {
            callback([], {
                chargeSessionID: 2,
                chargerID,
                userID,
                startTime
            })
        },
        getChargeSession: function (chargeSessionID, callback) {
            callback([], { ...defaultItem, chargeSessionID })
        },
        getChargeSessions: function (chargerID, callback) {
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
        chargerID: 100000,
        coordinates: [57.749812214261034, 14.070100435207065],
        serialNumber: "abc123",
        status: 'Available'
    }

    return {
        getChargers: function (callback) {
            callback([], [defaultItem])
        },
        getCharger: function (chargerID, callback) {
            callback([], {
                ...defaultItem,
                chargerID
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
        addCharger: function (chargePointID, serialNumber, coordinates, callback) {
            const newCharger = {
                chargerID: 2,
                chargePointID,
                serialNumber,
                coordinates,
            }

            callback([], newCharger)
        },
        removeCharger: function (chargerID, callback) {
            callback([], true)
        },
        updateChargerStatus: function (chargerID, status, callback) {
            callback([], {
                ...defaultItem,
                chargerID,
                status
            })
        },
    }
}

function reservationsRepositoryMock() {
    const defaultItem = {
        reservationID: 1,
        startTime: 1,
        endTime: 100,
        userID: 1337,
        chargerID: 1338
    }

    return {
        getReservation: function (reservationID, callback) {
            callback([], defaultItem)
        },
        getReservationsForCharger: function (chargerID, callback) {
            callback([], [{ ...defaultItem, chargerID }])
        },
        getReservationsForUser: function (userID, callback) {
            callback([], [{ ...defaultItem, userID }])
        },
        addReservation: function (chargerID, userID, start, end, callback) {
            callback([], {
                reservationID: 2,
                chargerID,
                userID,
                start,
                end
            })
        },
        removeReservation: function (reservationID, callback) {
            callback([], true)
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
        getTransactionsForCharger: function( chargerID, callback) {
            callback([], [{
                ...defaultItem,
                chargerID
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
        remoteStartTransaction: function(chargerID, transactionID, callback) {
            callback(null, {
                meterStart: 1032
            })
        },
        remoteStopTransaction: function(chargerID, transactionID, callback) {
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
    newDataAccessLayerChargePoints: awilix.asFunction(chargePointRepositoryMock),
    newDataAccessLayerChargeSessions: awilix.asFunction(chargeSessionsRepositoryMock),
    newDataAccessLayerChargers: awilix.asFunction(chargersRepositoryMock),
    newDataAccessLayerReservations: awilix.asFunction(reservationsRepositoryMock),
    newDataAccessLayerTransactions: awilix.asFunction(transactionsRepositoryMock),
    newDataAccessLayerElectricityTariffs: awilix.asFunction(electricityTarriffRepositoryMock),
    newDataAccessLayerKlarnaPayments: awilix.asFunction(klarnaPaymentsRepositoryMock),
    newDataAccessLayerKlarna: awilix.asFunction(klarnaRepositoryMock),

    // BLL
    newDatabaseInterfaceChargers: awilix.asFunction(require('./database-Interface/new-database-interface-chargers')),
    newDatabaseInterfaceChargeSessions: awilix.asFunction(require('./database-Interface/new-database-interface-charge-sessions')),
    newDatabaseInterfaceTransactions: awilix.asFunction(require('./database-Interface/new-database-interface-transaction')),
    newDatabaseInterfaceReservations: awilix.asFunction(require('./database-Interface/new-database-interface-reservations')),
    newDatabaseInterfaceChargePoints: awilix.asFunction(require('./database-Interface/new-database-interface-charge-points')),
    newDatabaseInterfaceElectricityTariffs: awilix.asFunction(require('./database-Interface/new-database-interface-electricity-tariff')),
    newDatabaseInterfaceKlarnaPayments: awilix.asFunction(require('./database-Interface/new-database-interface-klarna-payments')),
    // databaseInterfaceInvoices: awilix.asFunction(require('./database-Interface/database-interface-invoices')),

    // Validation
    newChargerValidation: awilix.asFunction(require("./database-Interface/validation/newChargerValidation")),
    newChargeSessionValidation: awilix.asFunction(require("./database-Interface/validation/newChargeSessionValidation")),
    newChargePointValidation: awilix.asFunction(require("./database-Interface/validation/newChargePointValidation")),
    newTransactionValidation: awilix.asFunction(require("./database-Interface/validation/newTransactionValidation")),
    newReservationValidation: awilix.asFunction(require("./database-Interface/validation/newReservationValidation")),
    newKlarnaPaymentsValidation: awilix.asFunction(require("./database-Interface/validation/newKlarnaPaymentsValidation")),
    // OCPP
    ocppInterface: awilix.asFunction(ocppInterfaceMock),

    dbErrorCheck: awilix.asFunction(require('./database-Interface/error/database-error-check')),
})

module.exports = testContainer