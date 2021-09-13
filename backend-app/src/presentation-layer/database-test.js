/** This file should be removed before production,
 *  Only used for testing the database connection.
 */
const express = require('express')

module.exports = function({ databaseInterfaceCharger, databaseInterfaceReservations, databaseInterfaceTransactions }) {

    const router = express.Router()

    router.use('/', function(request, response, next) {
        next()
    })

    router.get("/check", function(request, response) {

        switch ('charger') {
            case 'charger':

                const point = {
                    type: 'Point',
                    coordinates: [39.807222, -76.984722]
                };
                const charger = {
                    chargerID: 1,
                    location: [57.777725, 14.163085],
                    chargePointID: 1,
                    status: 1
                }

                databaseInterfaceCharger.addCharger(charger.chargerID, charger.chargePointID, charger.location, function(errors, chargerAdded) {
                    console.log(errors)
                    console.log(chargerAdded)
                    response.redirect("/")

                    // databaseInterfaceCharger.getChargers(function(errors, chargers) {
                    //     console.log(errors)
                    //     console.log(chargers)
                    //     response.redirect("/")
                    // })

                    // databaseInterfaceCharger.getCharger(charger.chargerID, function(errors, charger) {
                    //     console.log(errors)
                    //     console.log(charger)
                    //     response.redirect("/")
                    // })

                    // databaseInterfaceCharger.getAvailableChargers(function(errors, chargers) {
                    //     console.log(errors)
                    //     console.log(chargers)
                    //     response.redirect("/")
                    // })

                    // databaseInterfaceCharger.removeCharger(charger.chargerID, function(errors, chargers) {
                    //     console.log(errors)
                    //     console.log(chargers)
                    //     response.redirect("/")
                    // })

                    // databaseInterfaceCharger.updateChargerStatus(charger.chargerID, charger.status, function(errors, chargers) {
                    //     console.log(errors)
                    //     console.log(chargers)
                    //     response.redirect("/")
                    // })

                })

                // databaseInterfaceCharger.getChargers(function(errors, chargers) {
                //     console.log(errors)
                //     console.log(chargers)
                //     response.redirect("/")
                // })

                break;
            case 'reservation':
                const reservation = {
                    reservationID: 3,
                    userID: 3,
                    chargerID: 3,
                    start: '5467',
                    end: '201'
                }
                databaseInterfaceReservations.createReservations(reservation, function(errors, success) {
                    console.log(errors)
                    console.log(success)
                    response.redirect("/")
                })

                break;
            case 'transaction':

                const transaction = {
                    transactionID: 1,
                    userID: 1,
                    chargerID: 3,
                    meterStart: 22,
                    meterStop: 44,
                    timestamp: 12,
                    paymentID: 44
                }

                databaseInterfaceTransactions.createTransaction(transaction, function(errors, success) {
                    console.log(errors)
                    console.log(success)
                    response.redirect("/")
                })

                break;

            default:
                break;
        }
    })

    return router
}