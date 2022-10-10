const Ajv = require("ajv")
const ajv = new Ajv({strict: false, strictRequired: true})

module.exports = function ({ constants }){

    /**
     * THESE VALIDATION FUNCTIONS SHOULD BE ABLE TO VALIDATE PRODUCTION MESSAGES AS WELL, IF ONE WISHES TO DO SO
     */

    getMessageErrorsWithSchema = function(parsedMessage, schema, messageActionString){
        console.log('\n---------- Validating ' + messageActionString + ' ----------')

        const validate = ajv.compile(schema)
        const valid = validate(parsedMessage)

        console.log('MESSAGE: ', parsedMessage)
        console.log('MESSAGE IS VALID: ', valid)

        if(!valid){
            console.log('======= ' + messageActionString + ' VALIDATION ERRORS: =======\n', validate.errors)
            console.log('Compared schema:', schema)
            return validate.errors
        } else {
            console.log('\n---------- ' + messageActionString + ' passed validation ----------\n')
            return []
        }
    }

    exports.validateBootNotificationConf = function (parsedMessage) {
        const bootNotificationConfSchema = {
            type: "array",
            items: [
                {type: "integer"},
                {type: "string"},
                {type: "string"},
                {
                    type: "object",
                    properties: {
                        status: {type: "string"},
                        currentTime: {type: "integer"},
                        interval: {type: "integer"}
                    },
                    required: ["status", "currentTime", "interval"]
                }
            ]
        }

        const validationErrors = getMessageErrorsWithSchema(parsedMessage, bootNotificationConfSchema, 'BootNotificationConf')
        return validationErrors
    }

    exports.validateStartTransactionReq = function (parsedMessage) {
        const StartTransactionReqSchema = {
            type: "array",
            items: [
                {type: "integer"},
                {type: "string"},
                {type: "string"},
                {
                    type: "object",
                    properties: {
                        connectorId: {type: "integer"},                        
                        idTag: {type: "integer"},
                        meterStart: {type: "integer"},
                        timestamp: {type: "integer"}
                    },
                    required: ["connectorId", "idTag", "meterStart", "timestamp"]
                }
            ]
        }        

        const validationErrors = getMessageErrorsWithSchema(parsedMessage, StartTransactionReqSchema, 'StartTransactionReq')
        return validationErrors
    }

    exports.validateStartTransactionConf = function (parsedMessage) {
        const remoteStartResSchema = {
            type: "array",
            items: [
                {type: "integer"},
                {type: "string"},
                {type: "string"},
                {
                    type: "object",
                    properties: {
                        idTagInfo: {type: "integer"},
                        transactionId: {type: "integer"}
                    },
                    required: ["idTagInfo", "transactionId"]
                }
            ]
        }

        const validationErrors = getMessageErrorsWithSchema(parsedMessage, remoteStartResSchema, 'StartTransactionConf')
        return validationErrors
    }


    exports.validateRemoteStartTransactionReq = function (parsedMessage) {
        const remoteStartReqSchema = {
            type: "array",
            items: [
                {type: "integer"},
                {type: "string"},
                {type: "string"},
                {
                    type: "object",
                    properties: {
                        connectorId: {type: "integer"},
                        idTag: {type: "integer"},
                    },
                    required: ["connectorId", "idTag"]
                }
            ]
        }

        const validationErrors = getMessageErrorsWithSchema(parsedMessage, remoteStartReqSchema, 'RemoteStartTransactionReq')
        return validationErrors
    }

    exports.validateRemoteStopTransactionReq = function (parsedMessage) {
        const remoteStopReqSchema = {
            type: "array",
            items: [
                {type: "integer"},
                {type: "string"},
                {type: "string"},
                {
                    type: "object",
                    properties: {
                        transactionID: {type: "integer"}
                    },
                    required: ["transactionID"]
                }
            ]
        }

        const validationErrors = getMessageErrorsWithSchema(parsedMessage, remoteStopReqSchema, 'RemoteStopTransactionReq')
        return validationErrors
    }

    exports.validateStopTransactionConf = function(parsedMessage){
        const stopTransactionConfSchema = {
            type: "array",
            items: [
                {type: "integer"},
                {type: "string"},
                {type: "string"},
                {
                    type: "object",
                    properties: {
                        status: {type: "string"}
                    },
                    required: ["status"]
                }
            ]
        }
        
        const validationErrors = getMessageErrorsWithSchema(parsedMessage, stopTransactionConfSchema, 'StopTransactionConf')
        return validationErrors
    }


    exports.validateReserveNowReq = function (parsedMessage) {
        const ReserveNowReqSchema = {
            type: "array",
            items: [
                {type: "integer"},
                {type: "string"},
                {type: "string"},
                {
                    type: "object",
                    properties: {
                        connectorId: {type: "integer"},
                        expiryDate: {type: "integer"},
                        idTag: {type: "integer"},
                        reservationId: {type: "integer"}
                    },
                    required: ["connectorId", "expiryDate", "idTag", "reservationId"]
                }
            ]
        }        

        const validationErrors = getMessageErrorsWithSchema(parsedMessage, ReserveNowReqSchema, 'ReserveNowReq')
        return validationErrors
    }

    exports.validateDataTransferReq = function (parsedMessage) {
        const dataTransferReqSchema = {
            type: "array",
            items: [
                {type: "integer"},
                {type: "string"},
                {type: "string"},
                {
                    type: "object",
                    properties: {
                        vendorId: {type: "string"},
                        messageId: {type: "string"},
                        data: {
                            type: "object",
                            properties: {
                                chargerId: {type: "integer"},
                                chargingPrice: {type: "number"}
                            }
                        }
                    },
                    required: ["vendorId", "messageId", "data"]
                }
            ]
        }        

        const validationErrors = getMessageErrorsWithSchema(parsedMessage, dataTransferReqSchema, 'DataTransferReq')
        return validationErrors
    }

    exports.validateMeterValuesReq = function (parsedMessage) {
        const meterValuesReqSchema = {
            type: "array",
            items: [
                {type: "integer"},
                {type: "string"},
                {type: "string"},
                {
                    type: "object", 
                    properties: {
                        connectorId: {type: "number"},
                        transactionId: {type: "number"},
                        timestamp: {type: "number"},
                        values: {
                            type: "object", 
                            properties: {
                                chargingPercent: {
                                    type: "object", 
                                    properties: {
                                        value: {type: "number"},
                                        unit: {type: "string"},
                                        measurand: {type: "string"
                                    }
                                }},
                                required: ["value", "unit", "measurand"],
                                chargingPower: {
                                    type: "object", 
                                    properties: {
                                        value: {type: "number"},
                                        unit: {type: "string"},
                                        measurand: {type: "string"
                                    }
                                }},
                                required: ["value", "unit", "measurand"],
                                chargedSoFar: {
                                    type: "object", 
                                    properties: {
                                        value: {type: "number"},
                                        unit: {type: "string"},
                                        measurand: {type: "string"
                                    }
                                }},
                                required: ["value", "unit", "measurand"],
                            }
                        }
                    },
                    required: ["connectorId", "transactionId", "timestamp", "values"],
                }
            ]
        }  

        const validationErrors = getMessageErrorsWithSchema(parsedMessage, meterValuesReqSchema, 'MeterValuesReq')
        return validationErrors
    }

    exports.validateMeterValuesConf = function(){
        const meterValuesConfSchema = {
            type: "array",
            items: [
                {type: "integer"},
                {type: "string"},
                {type: "string"}
            ]
        }

        const validationErrors = getMessageErrorsWithSchema(parsedMessage, meterValuesConfSchema, 'MeterValuesConf')
        return validationErrors
    }

    return exports
}