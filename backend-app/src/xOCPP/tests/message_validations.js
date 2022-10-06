module.exports = function ({ constants }){
    let errors = [] 

    exports.checkJSONBootNotificationReq = function (message) {
        const parsedMessage = JSON.parse(message)
        if(parsedMessage.hasOwnProperty('chargePointVendor')){
            
        }
        if(parsedMessage.hasOwnProperty('chargePointModel')){

        }
        if(parsedMessage.hasOwnProperty('chargePointSerialNumber')){//optional

        }
        if(parsedMessage.hasOwnProperty('firmwareVersion')){//optional

        }
        if(parsedMessage.hasOwnProperty('iccid')){//optional

        }
        if(parsedMessage.hasOwnProperty('imsi')){//optional

        }
        if(parsedMessage.hasOwnProperty('meterType')){//optional

        }
        if(parsedMessage.hasOwnProperty('meterSerialNumber')){//optional

        }
    }

    exports.checkJSONBootNotificationConf = function (message) {
        if(parsedMessage.hasOwnProperty('status')){

        }
        if(parsedMessage.hasOwnProperty('currentTime')){

        }
        if(parsedMessage.hasOwnProperty('interval')){

        }
    }

    exports.checkJSONStartTransactionReq = function (message) {
        const parsedMessage = JSON.parse(message)
        if(parsedMessage.hasOwnProperty('connectorId')){

        }
        if(parsedMessage.hasOwnProperty('idTag')){

        }
        if(parsedMessage.hasOwnProperty('meterStart')){

        }
        if(parsedMessage.hasOwnProperty('reservationId')){//optional

        }
        if(parsedMessage.hasOwnProperty('timestamp')){

        }
    }

    exports.checkJSONStartTransactionConf = function (message) {
        if(parsedMessage.hasOwnProperty('idTag')){

        }
        if(parsedMessage.hasOwnProperty('transactionId')){

        }
    }

    exports.checkJSONStopTransactionReq = function (message) {
        const parsedMessage = JSON.parse(message)
        if(parsedMessage.hasOwnProperty('connectorId')){

        }
        if(parsedMessage.hasOwnProperty('idTag')){//optional

        }
        if(parsedMessage.hasOwnProperty('meterStop')){

        }
        if(parsedMessage.hasOwnProperty('reservationId')){

        }
        if(parsedMessage.hasOwnProperty('transactionId')){

        }
        if(parsedMessage.hasOwnProperty('timestamp')){

        }
    }

    exports.checkJSONStopTransactionConf = function (message) {
        if(parsedMessage.hasOwnProperty('idTag')){

        }
    }

    exports.checkJSONRemoteStartTransactionReq = function (message) {
        const parsedMessage = JSON.parse(message)
        if(parsedMessage.hasOwnProperty('connectorId')){//optional

        }
        if(parsedMessage.hasOwnProperty('idTag')){

        }
        if(parsedMessage.hasOwnProperty('chargingProfile')){//optional

        }
    }

    exports.checkJSONRemoteStartTransactionConf = function (message) {
        if(parsedMessage.hasOwnProperty('status')){

        }
    }

    exports.checkJSONRemoteStopTransactionReq = function (message) {
        const parsedMessage = JSON.parse(message)
        if(parsedMessage.hasOwnProperty('transactionId')){
        }
    }

    exports.checkJSONRemoteStopTransactionConf = function (message) {
        if(parsedMessage.hasOwnProperty('status')){

        }
    }

    exports.checkJSONReserveNowReq = function (message) {
        const parsedMessage = JSON.parse(message)
        if(parsedMessage.hasOwnProperty('connectorId')){

        }
        if(parsedMessage.hasOwnProperty('expiryDate')){

        }
        if(parsedMessage.hasOwnProperty('idTag')){

        }
        if(parsedMessage.hasOwnProperty('reservationId')){

        }
    }

    exports.checkJSONReserveNowConf = function (message) {
        if(parsedMessage.hasOwnProperty('status')){

        }
    }

    exports.checkJSONDataTransferReq = function (message) {
        if(parsedMessage.hasOwnProperty('vendorId')){

        }
    }

    exports.checkJSONDataTransferConf = function (message) {
        if(parsedMessage.hasOwnProperty('status')){
                    
        }
    }

    exports.checkJSONMeterValues = function (message) {
        if(parsedMessage.hasOwnProperty('chargingPercent')){
                    
        }
        if(parsedMessage.hasOwnProperty('chargingPower')){
                    
        }
        if(parsedMessage.hasOwnProperty('chargedSoFar')){
                    
        }
    }

    handleError = function(error){
        if(error){
            errors.push(error)
        }
    }
}