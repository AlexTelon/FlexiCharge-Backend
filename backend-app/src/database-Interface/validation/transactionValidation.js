module.exports = function({}) {

    //Validation for Meterstart
    METERSTART_MIN_VALUE = 0
    //Validation for Meterstop
    METERSTOP_MIN_VALUE = 0

    const exports = {}

    exports.getAddTransactionValidation = function(MeterStartValue){
        const validationErrors = []

        if(MeterStartValue < METERSTART_MIN_VALUE){
            validationErrors.push("invalidMeterStartValue")
        }

        return validationErrors
    }

    exports.getUpdateTransactionMeterValidation = function(meterValue){
        const validationErrors = []

        if(meterValue < METERSTOP_MIN_VALUE){
            validationErrors.push("invalidMeterStopValue")
        }

        return validationErrors
    }

    return exports
}