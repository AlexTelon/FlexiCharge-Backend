module.exports = function({}) {
    //Status codes 
    const statusCodes = ["Available", "Preparing", "Charging", "SuspendedEVSE", "SuspendedEV", "Finishing", "Reserved", "Unavailable", "Faulted"]

    //Validation for coordinates
    LONGITUDE_MIN_VALUE = -180
    LONGITUDE_MAX_VALUE = 180
    LATITUDE_MIN_VALUE = -90
    LATITUDE_MAX_VALUE = 90

    //Validation for serial number
    SERIAL_NUMBER_MIN_VALUE = 1
    SERIAL_NUMBER_MAX_VALUE = 36

    const exports = {}

    exports.getAddChargerValidation = function(coordinates, serialNumber, chargePointID) {

        const validationErrors = []

        if (coordinates === undefined || coordinates === null) {
            validationErrors.push("invalidCoordinates")
        } else {
            if ((coordinates instanceof Array) == false || (typeof coordinates[0] !== 'number') || (typeof coordinates[1] !== 'number')) {
                validationErrors.push("invalidDataType")
            }
            if (coordinates[0] < LATITUDE_MIN_VALUE || coordinates[0] > LATITUDE_MAX_VALUE) {
                validationErrors.push("invalidLatitude")
            }
            if (coordinates[1] < LONGITUDE_MIN_VALUE || coordinates[1] > LONGITUDE_MAX_VALUE) {
                validationErrors.push("invalidLongitude")
            }
        }
        if (serialNumber === undefined || serialNumber === null) {
            validationErrors.push("invalidSerialNumber")
        } else {
            if (typeof serialNumber !== 'string') {
                validationErrors.push("invalidDataType")
            }
            if (serialNumber.length < SERIAL_NUMBER_MIN_VALUE || serialNumber.length > SERIAL_NUMBER_MAX_VALUE) {

                validationErrors.push("invalidSerialNumber")
            }
        }

        if(chargePointID === undefined || chargePointID === null) {
            validationErrors.push("invalidChargePointID")
        }

        return validationErrors
    }

    exports.getChargerBySerialNumberValidation = function(serialNumber) {
        const validationErrors = []

        if (serialNumber === undefined || serialNumber === null) {
            validationErrors.push("invalidSerialNumber")
        } else {
            if (typeof serialNumber !== 'string') {
                validationErrors.push("invalidDataType")
            }
            if (serialNumber.length < SERIAL_NUMBER_MIN_VALUE || serialNumber.length > SERIAL_NUMBER_MAX_VALUE) {
                validationErrors.push("invalidSerialNumber")
            }
        }

        return validationErrors
    }

    exports.getUpdateChargerStatusValidation = function(status) {
        const validationErrors = []

        if (status === undefined || status === null) {
            validationErrors.push("invalidStatus")
        } else {
            if (typeof status !== 'string') {
                ValidationErrors.push("invalidDataType")
            }
            if (!statusCodes.includes(status)) {
                validationErrors.push("invalidStatus")
            }
        }

        return validationErrors
    }

    return exports

}