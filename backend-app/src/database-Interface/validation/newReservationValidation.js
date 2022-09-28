module.exports = function({}) {

    //Validation for Start
    START_MIN_VALUE = 0
    //Validation for Stop
    END_MIN_VALUE = 0

    const exports = {}

    exports.getReservationValidation = function(reservationID){
        const validationErrors = []
        
        if(reservationID == null || reservationID == undefined){
            validationErrors.push("invalidReservationID")
        }

        return validationErrors
    }

    exports.getReservationForChargerValidation = function(chargerID){
        const validationErrors = []

        if(chargerID == null || chargerID == undefined) {
            validationErrors.push("invalidChargerID")
        }

        return validationErrors
    }

    exports.getReservationForUserValidation = function(userID){
        const validationErrors = []

        if(userID == null || userID == undefined){
            validationErrors.push("invalidUserID")
        }

        return validationErrors
    }

    exports.getAddReservationValidation = function(start, end){
        const validationErrors = []

        if(start < START_MIN_VALUE){
            validationErrors.push("invalidStartValue")
        }
        if(end < END_MIN_VALUE){
            validationErrors.push("invalidEndValue")
        }
        if(end < start){
            validationErrors.push("startGreaterThenEnd")
        }

        return validationErrors
    }

    exports.getRemoveReservationValidation = function(reservationID){
        const validationErrors = []

        if(reservationID == null || reservationID == undefined) {
            validationErrors.push("invalidReservationID")
        }

        return validationErrors
    }

    return exports
}