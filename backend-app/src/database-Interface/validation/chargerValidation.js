module.exports = function({}) {


    //Validation for status
    STATUS_MIN_VALUE = 0

    //Validation for location
    LONGITUDE_MIN_VALUE = -180
    LONGITUDE_MAX_VALUE = 180
    LATITUDE_MIN_VALUE = -90
    LATITUDE_MAX_VALUE = 90

    //Validation for serial number
    SERIAL_NUMBER_MIN_VALUE = 1
    SERIAL_NUMBER_MAX_VALUE = 36



    const exports = {}

    exports.getAddChargerValidation = function(location, serialNumber) {

        const validationErrors = []

        if (location[0] < LATITUDE_MIN_VALUE || location[0] > LATITUDE_MAX_VALUE) {
            validationErrors.push("invalidLatitude")
        }
        if (location[1] < LONGITUDE_MIN_VALUE || location[1] > LONGITUDE_MAX_VALUE) {
            validationErrors.push("invalidLongitude")
        }
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