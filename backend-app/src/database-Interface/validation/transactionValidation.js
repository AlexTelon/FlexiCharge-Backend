module.exports = function({}) {

    //Validation for Charge Precentage
    MAX_CHARGE_PRECENTAGE = 100
    MIN_CHARGE_PRECENTAGE = 0

    //Validation for Kwh Price
    MIN_KWH_PRICE = 0

    //Validation for Transfered Kwh
    MIN_TRANSFERED_KWH = 0

    const exports = {}

    exports.getAddTransactionValidation = function(currentChargePercentage, pricePerKwh) {
        const validationErrors = []

        if (pricePerKwh < MIN_KWH_PRICE) {
            validationErrors.push("invalidKwhPrice")
        }

        return validationErrors
    }

    exports.getUpdateTransactionChargingStatus = function(kwhTransfered, currentChargePercentage) {
        const validationErrors = []

        if (currentChargePercentage < MIN_CHARGE_PRECENTAGE) {
            validationErrors.push("invalidChargePrecentage")
        }
        if (currentChargePercentage > MAX_CHARGE_PRECENTAGE) {
            validationErrors.push("invalidChargePrecentage")
        }
        if (kwhTransfered < MIN_TRANSFERED_KWH) {
            validationErrors.push("invalidTransferedKwh")
        }

        return validationErrors
    }

    return exports
}