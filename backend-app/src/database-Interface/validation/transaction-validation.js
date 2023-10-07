module.exports = function({}) {

    //Validation for Charge PERCENTAGE
    MAX_CHARGE_PERCENTAGE = 100
    MIN_CHARGE_PERCENTAGE = 0

    //Validation for Kwh Price
    MIN_KWH_PRICE = 0

    //Validation for Transfered Kwh
    MIN_TRANSFERED_KWH = 0

    //Validation for session_id
    MIN_SESSION_ID = 1

    //Validation for client_token
    MIN_CLIENT_TOKEN = 1

    const exports = {}

    exports.getAddTransactionValidation = function(chargeSessionID, userID, payNow) {
        const validationErrors = []

        if(chargeSessionID == null || chargeSessionID == undefined){
            validationErrors.push("invalidChargeSessionID")
        }

        if(userID == null || userID == undefined){
            validationErrors.push("invalidUserID")
        }

        if(payNow == null || payNow == undefined){
            validationErrors.push("invalidPayNow")
        }

        return validationErrors
    }

    exports.getTransactionValidation = function(transactionID){
        const validationErrors = []

        if(transactionID == null || transactionID == undefined){
            validationErrors.push("invalidTransactionID")
        }

        return validationErrors
    }

    exports.getTransactionsForUserValidation = function(userID) {
        const validationErrors = []

        if(userID == null || userID == undefined){
            validationErrors.push("invalidUserID")
        }

        return validationErrors
    }

    exports.getTransactionsForChargerValidation = function(connectorID){
        const validationErrors = []

        if(connectorID == null || connectorID == undefined){
            validationErrors.push("invalidconnectorID")
        }

        return validationErrors
    }

    exports.getUpdatePaymentMethodValidation = function(transactionID, paymentMethod){
        const validationErrors = []

        if(transactionID == null || transactionID == undefined){
            validationErrors.push("invalidTransactionID")
        }

        if(paymentMethod == null || paymentMethod == undefined){
            validationErrors.push("invalidPaymentMethod")
        }

        return validationErrors
    }

    exports.getUpdatepaidDateValidation = function(transactionID, paidDate){
        const validationErrors = []

        if(transactionID == null || transactionID == undefined){
            validationErrors.push("invalidTransactionID")
        }

        if(paidDate == null || paidDate == undefined){
            validationErrors.push("invalidpaidDate")
        } else {
            let dateObject = new Date(paidDate)
            if(dateObject == null || dateObject == undefined ) {
                validationErrors.push("invalidpaidDate")
            }
            if(isNaN(dateObject.getMonth())) {
                //String recieved tried to convert to a date object and failed.
                validationErrors.push("invalidpaidDate")
            }
        }

        return validationErrors
    }

    exports.getUpdateTotalPriceValidation = function(transactionID, totalPrice){
        const validationErrors = []

        if(transactionID == null || transactionID == undefined) {
            validationErrors.push("invalidTransactionID")
        }

        if(totalPrice == null || transactionID == undefined){
            validationErrors.push("invalidTotalPrice")
        }

        return validationErrors

    }

    exports.getUpdateTransactionChargingStatus = function(currentMeterValue, currentChargePercentage) {
        const validationErrors = []

        if (currentChargePercentage == null || currentChargePercentage == undefined || currentChargePercentage < MIN_CHARGE_PERCENTAGE || currentChargePercentage > MAX_CHARGE_PERCENTAGE || currentChargePercentage % 1 != 0) {
            validationErrors.push("invalidChargePercentage")
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
