const { Client } = require('pg')

module.exports = function({databaseInit}) {

    const exports = {}
    exports.createCharger = function(charger,callback) {

        databaseInit.Chargers.create(charger)
            .then(a=> callback([],charger.chargerID))
            .catch(e=>{
                if(e){
                    console.log(e)
                    callback("Can not create charger", null)
                }else{
                    console.log(e)
                    callback(e, null)
                }
            })
        
    }
    exports.createTransaction = function(transaction,callback) {

        databaseInit.Transactions.create(transaction)
            .then(a=> callback([],transaction.transactionID))
            .catch(e=>{
                if(e){
                    console.log(e)
                    callback("Can not create transaction", null)
                }else{
                    console.log(e)
                    callback(e, null)
                }
            })
        
    }
    exports.createReservations = function(reservation,callback) {

        databaseInit.Reservations.create(reservation)
            .then(a=> callback([],reservation.reservationID))
            .catch(e=>{
                if(e){
                    console.log(e)
                    callback("Can not create reservation", null)
                }else{
                    console.log(e)
                    callback(e, null)
                }
            })
        
    }
    return exports
}