const { Client } = require('pg')
const db = require("./db")

const INTERNAL_ERROR = "internalError"

module.exports = function({}){
    return{
        getAllChargers: function(callback){
            db.Chargers.findAll({})
            .then(function(charger){
                const allChargers = []
                if(charger.length > 0){
                    charger.forEach(Chargers => {
                        allChargers.push({
                            chargerID: Chargers.dataValues.chargerID,
                            location: Chargers.dataValues.location,
                            chargerPointID: Chargers.dataValues.chargerPointID,
                            status: Chargers.dataValues.status
                        })
                    });
                }
                callback([], allChargers)
            })
            .catch(e => callback([INTERNAL_ERROR]), null)
        },
        getChargerById: function(chargerID, callback){
            db.Chargers.findAll({
                where:{
                    chargerID: chargerID
                },
                raw: true
            })
            .then(function(Chargers){
                if(Chargers.length > 0){
                    callback([], Chargers)
                }
            })
            .catch(e => callback([INTERNAL_ERROR]), null)
        },
        getAllAvailableChargers: function(callback){
            db.Chargers.findAll({
                where:{
                    status: 1
                },
                raw: true
            })
            .then(function(Chargers){
                if(Chargers.length > 0){
                    callback([], Chargers)
                }
            })
            .catch(e => callback([INTERNAL_ERROR]), null)
        },
        addCharger: function(chargerId, chargePointId, location, callback){
            db.Chargers.create({chargerID: chargerID, chargePointID: chargerPointID, location: location}, {raw: true})
            .then(function(Chargers){
                if(Chargers.length > 0){

                }else {
                    
                }
                callback([])
            })
        }

    }

}



// module.exports = function({databaseInit}) {

//     const exports = {}
//     exports.createCharger = function(charger,callback) {

//         databaseInit.Chargers.create(charger)
//             .then(a=> callback([],charger.chargerID))
//             .catch(e=>{
//                 if(e){
//                     console.log(e)
//                     callback("Can not create charger", null)
//                 }else{
//                     console.log(e)
//                     callback(e, null)
//                 }
//             })
        
//     }
//     exports.createTransaction = function(transaction,callback) {

//         databaseInit.Transactions.create(transaction)
//             .then(a=> callback([],transaction.transactionID))
//             .catch(e=>{
//                 if(e){
//                     console.log(e)
//                     callback("Can not create transaction", null)
//                 }else{
//                     console.log(e)
//                     callback(e, null)
//                 }
//             })
        
//     }
//     exports.createReservations = function(reservation,callback) {

//         databaseInit.Reservations.create(reservation)
//             .then(a=> callback([],reservation.reservationID))
//             .catch(e=>{
//                 if(e){
//                     console.log(e)
//                     callback("Can not create reservation", null)
//                 }else{
//                     console.log(e)
//                     callback(e, null)
//                 }
//             })
        
//     }
//     return exports
// }