/** This file should be removed before production,
 *  Only used for testing the database connection.
 */
const express = require('express')

module.exports = function({ databaseInterfaceCharger, databaseInterfaceReservations, databaseInterfaceTransactions }) {

    const router = express.Router()

    router.use('/', function(request, response, next) {
        next()
    })

    router.get("/check", async function(request, response) {

        switch ('transaction') {
            case 'charger':

                const point = {
                    type: 'Point',
                    coordinates: [39.807222, -76.984722]
                };
                const charger = {
                    chargerID: 1,
                    location: [57.777726, 14.163085],
                    chargePointID: 1,
                    status: 2
                }



                // databaseInterfaceCharger.addCharger(charger.chargePointID, charger.location, function(errors, chargerAdded) {
                //     console.log(errors)
                //     console.log(chargerAdded)

                //     databaseInterfaceCharger.removeCharger(charger.chargerID, function(errors, chargers) {
                //         console.log(errors)
                //         console.log(chargers)
                //         response.redirect("/")
                //     })

                // })


                // databaseInterfaceCharger.addCharger(charger.chargePointID, charger.location, function(errors, chargerAdded) {
                //     console.log(errors)
                //     console.log(chargerAdded)
                //     response.redirect("/")
                // })


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



                // databaseInterfaceCharger.updateChargerStatus(charger.chargerID, charger.status, function(errors, updatedCharger) {
                //     console.log(errors)
                //     console.log(updatedCharger)
                //     response.redirect("/")
                // })

                // })

                // databaseInterfaceCharger.getChargers(function(errors, chargers) {
                //     console.log(errors)
                //     console.log(chargers)
                //     response.redirect("/")
                // })

                break;
            case 'reservation':
                const reservation = {
                    reservationID: 1,
                    userID: 1,
                    chargerID: 2,
                    start: 1,
                    end: 4
                }

                // databaseInterfaceReservations.getReservationForCharger(reservation.chargerID, function(errors, chargerReservation){
                //     console.log(errors)
                //     console.log(chargerReservation)
                //     response.redirect("/")
                // })

                // databaseInterfaceReservations.getReservationForUser(reservation.userID, function(errors, userReservation){
                //     console.log(errors)
                //     console.log(userReservation)
                //     response.redirect("/")
                // })

                // databaseInterfaceReservations.removeReservation(reservation.reservationID, function(errors, reservation){
                //     console.log(errors)
                //     console.log(reservation)
                //     response.redirect("/")
                // })

                // databaseInterfaceReservations.addReservation(reservation.chargerID, reservation.userID, reservation.start, reservation.end, function(errors, reservationId){
                //     console.log(errors)
                //     console.log(reservationId)
                //     response.redirect("/")
                // })

                // databaseInterfaceReservations.getReservation(reservation.reservationID, function(errors, reservation){
                //     console.log(errors)
                //     console.log(reservation)
                //     response.redirect("/")
                // })

                break;
            case 'transaction':

                const transaction = {
                    transactionID: 1,
                    userID: 1,
                    chargerID: 1,
                    meterStart: 22,
                    meterStop: 44,
                    timestamp: 12,
                    paymentID: 44
                }

                databaseInterfaceTransactions.addTransaction(transaction.userID, transaction.chargerID, transaction.meterStart, function(errors, transactionId) {
                    console.log(errors)
                    console.log(transactionId)
                    databaseInterfaceTransactions.updateTransactionMeter(transaction.transactionID, transaction.meterStop, function(errors, updatedTransaction) {
                        console.log(errors)
                        console.log(updatedTransaction)
                        response.redirect("/")
                    })
                })

                // databaseInterfaceTransactions.getTransaction(transaction.transactionID, function(errors, transaction) {
                //     console.log(errors)
                //     console.log(transaction)
                //     response.redirect("/")
                // })

                // databaseInterfaceTransactions.getTransactionsForUser(transaction.userID, function(errors, transactions) {
                //     console.log(errors)
                //     console.log(transactions)
                //     response.redirect("/")
                // })

                // databaseInterfaceTransactions.getTransactionsForCharger(transaction.chargerID, function(errors, transactions) {
                //     console.log(errors)
                //     console.log(transactions)
                //     response.redirect("/")
                // })

                // databaseInterfaceTransactions.updateTransactionPayment(transaction.transactionID, transaction.paymentID, function(errors, updatedTransaction) {
                //     console.log(errors)
                //     console.log(updatedTransaction)
                //     response.redirect("/")
                // })

                // databaseInterfaceTransactions.updateTransactionMeter(transaction.transactionID, transaction.meterStop, function(errors, updatedTransaction) {
                //     console.log(errors)
                //     console.log(updatedTransaction)
                //     response.redirect("/")
                // })

                break;

            default:
                break;
        }
    })

    return router
}