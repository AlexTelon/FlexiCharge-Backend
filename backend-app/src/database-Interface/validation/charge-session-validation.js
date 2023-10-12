module.exports = function({}){
    const exports = {}

    //Validation for Charge PERCENTAGE
    MAX_CHARGE_PERCENTAGE = 100
    MIN_CHARGE_PERCENTAGE = 0

    MIN_TRANSFERED_KWH = 0

    exports.getAddChargeSessionValidation = function(connectorID, userID){
        const validationErrors = []

        if(connectorID == null || connectorID == undefined){
            validationErrors.push("invalidconnectorID")
        }

        if(userID == null || userID == undefined){
            validationErrors.push("invalidUserID")
        }

        return validationErrors
    }

    exports.getUpdateChargingStateValidation = function(currentChargePercentage, kWhTransferred){
        const validationErrors = []

        if (currentChargePercentage == null || currentChargePercentage == undefined || currentChargePercentage < MIN_CHARGE_PERCENTAGE || currentChargePercentage > MAX_CHARGE_PERCENTAGE) {
            validationErrors.push("invalidChargePercentage")
        }

        if (kWhTransferred == null || kWhTransferred == undefined || kWhTransferred < MIN_TRANSFERED_KWH) {
            validationErrors.push("invalidkWhTransferredValue")
        }

        return validationErrors
    }

    exports.getChargeSessionValidation = function(chargeSessionID) {
        const validationErrors = []

        if(chargeSessionID == null || chargeSessionID == undefined){
            validationErrors.push("invalidChargeSessionID")
        }

        return validationErrors
    }

    exports.getChargeSessionsValidation = function(connectorID) {
        const validationErrors = []

        if(connectorID == null || connectorID == undefined){
            validationErrors.push("invalidChargeSessionID")
        }

        return validationErrors
    }

    exports.endChargeSessionValidation = function(chargeSessionID) {
        const validationErrors = []

        if(chargeSessionID == null || chargeSessionID == undefined){
            validationErrors.push("invalidChargeSessionID")
        }

        return validationErrors
    }

    exports.calculateTotalChargePriceValidation = function(chargeSessionID) {
        const validationErrors = []

        if(chargeSessionID == null || chargeSessionID == undefined){
            validationErrors.push("invalidChargeSessionID")
        }

        return validationErrors
    }

    exports.updateMeterStartValidation = function(chargeSessionID, meterStart) {
        const validationErrors = []

        if(chargeSessionID == null || chargeSessionID == undefined){
            validationErrors.push("invalidChargeSessionID")
        }

        if (meterStart == null || meterStart == undefined || typeof meterStart !== 'number') {
            validationErrors.push("invalidMeterValue")
        }

        return validationErrors
    }

    return exports
}
