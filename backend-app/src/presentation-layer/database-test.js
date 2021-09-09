/** This file should be removed before production,
 *  Only used for testing the database connection.
 */
const express = require('express')

module.exports = function({ businessLogicDatabase }) {

    const router = express.Router()

    router.use('/', function(request, response, next) {
        next()
    })

    router.get("/check", function(request, response) {

        switch ('transaction') {
            case 'charger':
                const charger = {
                    chargerID: '3',
                    location: 'x:15562e56e4265y:6276537637736z:738768368387',
                    chargePointID:'1337',
                    status:'200'
                }

                businessLogicDatabase.createCharger(charger,function(errors, success) {
                    console.log(errors)
                    console.log(success)
                    response.redirect("/")
                })
                
                break;
            case 'reservation':
                const reservation = {
                    reservationID: 3,
                    userID: 3,
                    chargerID: '5',
                    start:'5467',
                    end:'201'
                }
                businessLogicDatabase.createReservations(reservation,function(errors, success) {
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

                businessLogicDatabase.createTransaction(transaction,function(errors, success) {
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