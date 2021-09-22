module.exports = function({}) {

    //Validation for Start
    START_MIN_VALUE = 0
    //Validation for Stop
    END_MIN_VALUE = 0

    const exports = {}

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

    return exports
}