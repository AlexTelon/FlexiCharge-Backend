module.exports = function({}){
    const exports = {}

    //Validation for Charge PERCENTAGE
    MAX_CHARGE_PERCENTAGE = 100
    MIN_CHARGE_PERCENTAGE = 0

    MIN_TRANSFERED_KWH = 0

    exports.getAddChargeSessionValidation = function(chargerID, userID){
        const validationErrors = []

        if(chargerID == null || chargerID == undefined){
            validationErrors.push("invalidChargerID")
        }

        if(userID == null || userID == undefined){
            validationErrors.push("invalidUserID")
        }

        return validationErrors
    }

    exports.getUpdateChargingStateValidation = function(currentChargePercentage, kwhTransfered){
        const validationErrors = []
        
        if (currentChargePercentage == null || currentChargePercentage == undefined || currentChargePercentage < MIN_CHARGE_PERCENTAGE || currentChargePercentage > MAX_CHARGE_PERCENTAGE) {
            validationErrors.push("invalidChargePercentage")
        }

        if (kwhTransfered == null || kwhTransfered == undefined || kwhTransfered < MIN_TRANSFERED_KWH) {
            validationErrors.push("invalidkwhTransferedValue")
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

    return exports
}