module.exports = function({}) {

    //Validation for Charge Precentage
    MAX_CHARGE_PRECENTAGE = 100
    MIN_CHARGE_PRECENTAGE = 0

    //Validation for Kwh Price
    MIN_KWH_PRICE = 0

    //Validation for Transfered Kwh
    MIN_TRANSFERED_KWH = 0

    //Validation for session_id
    MIN_SESSION_ID = 1

    //Validation for client_token
    MIN_CLIENT_TOKEN = 1

    const exports = {}

    exports.getAddTransactionValidation = function(pricePerKwh) {
        const validationErrors = []

        if(pricePerKwh == undefined || pricePerKwh == null) {
            validationErrors.push("invalidKwhPrice")
        }
        else if(pricePerKwh < MIN_KWH_PRICE) {
            validationErrors.push("invalidKwhPrice")
        }

        return validationErrors
    }

    exports.getUpdateTransactionChargingStatus = function(currentMeterValue, currentChargePercentage) {
        const validationErrors = []

        if (currentChargePercentage == null || currentChargePercentage == undefined || currentChargePercentage < MIN_CHARGE_PRECENTAGE) {
            validationErrors.push("invalidChargePrecentage")
        }
        if (currentChargePercentage == null || currentChargePercentage == undefined || currentChargePercentage > MAX_CHARGE_PRECENTAGE) {
            validationErrors.push("invalidChargePrecentage")
        }
        if (currentMeterValue == null || currentMeterValue == undefined || currentMeterValue < MIN_TRANSFERED_KWH) {
            validationErrors.push("invalidMeterValue")
        }

        return validationErrors
    }

    exports.addKlarnaTransactionValidation = function(session_id, client_token) {

        const validationErrors = []

        if (session_id === undefined || session_id === null) {
            validationErrors.push("klarnaError")
        } else {
            if (typeof session_id !== 'string') {
                validationErrors.push("klarnaError")
            }
            if (session_id.length < MIN_SESSION_ID) {
                validationErrors.push("klarnaError")
            }
        }

        if (client_token === undefined || client_token === null) {
            validationErrors.push("klarnaError")
        } else {
            if (typeof client_token !== 'string') {
                validationErrors.push("klarnaError")
            }
            if (client_token.length < MIN_CLIENT_TOKEN) {
                validationErrors.push("klarnaError")
            }
        }

        return validationErrors
    }

    return exports
}