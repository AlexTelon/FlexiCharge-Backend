module.exports = function({ dataAccessLayerReservation }) {

    const exports = {}

    exports.getReservation = function(reservationID, callback){
        dataAccessLayerReservation.getReservation(reservationID, function(errorCodes, reservation){
            if(errorCodes.length > 0){
                callback(errorCodes, null)
            }else{
                callback([], reservation)
            }
        })

    }

    exports.getReservationForCharger = function(chargerID, callback){
        dataAccessLayerReservation.getReservationForCharger(chargerID, function(errorCodes, chargerReservation){
            if(errorCodes.length > 0){
                callback(errorCodes, null)
            }else{
                callback([], chargerReservation)
            }
        })
    }

    exports.getReservationForUser = function(userID, callback){
        dataAccessLayerReservation.getReservationForUser(userID, function(errorCodes, userReservation){
            if(errorCodes.length > 0){
                callback(errorCodes, null)
            }else{
                callback([], userReservation)
            }
        })
    }

    exports.addReservation = function(reservationID, chargerID, userID, start, end, callback){
        dataAccessLayerReservation.addReservation(reservationID, chargerID, userID, start, end, function(errorCodes, addReservation){ //addReservation = bool
            if(errorCodes.length > 0){
                callback(errorCodes, null)
            }else{
                callback([], addReservation)
            }
        })
    }

    exports.removeReservation = function(reservationID, callback){
        dataAccessLayerReservation.removeReservation(reservationID, function(errorCodes, removeReservation){ //removeReservation = bool
            if(errorCodes.length > 0){
                callback(errorCodes, null)
            }else{
                callback([], removeReservation)
            }
        })
    }


    return exports
}