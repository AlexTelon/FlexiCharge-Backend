module.exports = function({}) {


    //Validation for status
    STATUS_MIN_VALUE = 0

    //Validation for serial number
    SERIAL_NUMBER_MIN_VALUE = 1
    SERIAL_NUMBER_MAX_VALUE = 36



    const exports = {}

    exports.getAddChargerValidation = function(serialNumber) {

        const validationErrors = []

        if (serialNumber.length < SERIAL_NUMBER_MIN_VALUE || serialNumber.length > SERIAL_NUMBER_MAX_VALUE) {
            validationErrors.push("invalidSerialNumber")
        }

        return validationErrors
    }

    exports.getChargerBySerialNumberValidation = function(serialNumber) {
        const validationErrors = []

        if (serialNumber.length < SERIAL_NUMBER_MIN_VALUE || serialNumber.length > SERIAL_NUMBER_MAX_VALUE) {
            validationErrors.push("invalidSerialNumber")
        }

        return validationErrors
    }

    exports.getUpdateChargerStatusValidation = function(status) {
        const ValidationErrors = []

        if (status < STATUS_MIN_VALUE || status > STATUS_MAX_VALUE) {
            ValidationErrors.push("invalidStatus")
        }

        return ValidationErrors
    }

    return exports

}