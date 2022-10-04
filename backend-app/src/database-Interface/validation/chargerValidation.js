const { getLocationValidationErrors } = require('./validation-helpers')
module.exports = function({}) {
    //Status codes 
    const statusCodes = ["Available", "Preparing", "Charging", "SuspendedEVSE", "SuspendedEV", "Finishing", "Reserved", "Unavailable", "Faulted"]

    //Validation for serial number
    SERIAL_NUMBER_MIN_VALUE = 1
    SERIAL_NUMBER_MAX_VALUE = 36

    const exports = {}

    exports.getAddChargerValidation = function(location, serialNumber, chargePointID) {

        const validationErrors = [
            ...getLocationValidationErrors(location),
            ...getSerialNumberValidationErrors(serialNumber)
        ];

        if(chargePointID === undefined || chargePointID === null) {
            validationErrors.push("invalidChargePointID")
        }
        return validationErrors
    }

    exports.getChargerBySerialNumberValidation = function(serialNumber) {
        const validationErrors = [
            ...getSerialNumberValidationErrors(serialNumber)
        ];
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
function getSerialNumberValidationErrors(serialNumber){
    const validationErrors = [];
    
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
    return validationErrors;
}