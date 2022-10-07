const Ajv = require("ajv")
const ajv = new Ajv({strict: false, strictRequired: true})

module.exports = function ({ constants }){
    let errors = [] 

    /**
     * THESE VALIDATION FUNCTIONS SHOULD BE ABLE TO VALIDATE PRODUCTION MESSAGES, IF ONE WISHES TO DO SO
     */

    

        
        // const testSchema = {
        //     type: "array",
        //     items: [
        //         {"type": "string"},
        //         {"type": "integer"}
        //     ],
        //     additionalItems: false
        // }

        // const testObject = [
        //     "hejsan",
        //     2
        // ]

        // const validate = ajv.compile(testSchema)
        // const valid = validate(testObject)

        // console.log('!!!!!!!!MESSAGE: ', testObject)
        // console.log('RESULT IS VALID?: ', valid)

        // if(!valid){
        //     console.log('======= MESSAGE VALIDATION ERRORS: ======= ', validate.errors)
        // }
    

    exports.checkBootNotificationConf = function (parsedMessage) {
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

        const validate = ajv.compile(bootNotificationConfSchema)
        const valid = validate(parsedMessage)

        console.log('MESSAGE: ', parsedMessage)
        console.log('RESULT IS VALID?: ', valid)

        if(!valid){
            console.log('======= MESSAGE VALIDATION ERRORS: ======= ', validate.errors)
        }
        
    }

    exports.checkStartTransactionReq = function (parsedMessage) {
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

        const validate = ajv.compile(StartTransactionReqSchema)
        const valid = validate(parsedMessage)

        console.log('!!!!!!!!MESSAGE: ', parsedMessage)
        console.log('RESULT IS VALID?: ', valid)
        if(!valid){
            console.log('======= MESSAGE VALIDATION ERRORS: ======= ', validate.errors)
        }

    }

    exports.checkStartTransactionConf = function (parsedMessage) {
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

        const validate = ajv.compile(remoteStartResSchema)
        const valid = validate(parsedMessage)

        console.log('MESSAGE: ', parsedMessage)
        console.log('RESULT IS VALID: ', valid)

        if(!valid){
            console.log('======= MESSAGE VALIDATION ERRORS: ======= ', validate.errors)
        }
    }


    exports.checkRemoteStartTransactionReq = function (parsedMessage) {
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

        const validate = ajv.compile(remoteStartReqSchema)
        const valid = validate(parsedMessage)

        console.log('MESSAGE: ', parsedMessage)
        console.log('RESULT IS VALID: ', valid)

        if(!valid){
            console.log('======= MESSAGE VALIDATION ERRORS: ======= ', validate.errors)
        }
    }

    exports.checkRemoteStopTransactionReq = function (parsedMessage) {
        const remoteStartReqSchema = {
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

        const validate = ajv.compile(remoteStartReqSchema)
        const valid = validate(parsedMessage)

        console.log('MESSAGE: ', parsedMessage)
        console.log('RESULT IS VALID: ', valid)

        if(!valid){
            console.log('======= MESSAGE VALIDATION ERRORS: ======= ', validate.errors)
        }
        
        //TODO: IMPLEMENT!!!!!!!
    }

    exports.checkStopTransactionConf = function(parsedMessage){
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
        
        const validate = ajv.compile(stopTransactionConfSchema)
        const valid = validate(parsedMessage)

        console.log('!!!!!!!!MESSAGE: ', parsedMessage)
        console.log('RESULT IS VALID: ', valid)
        if(!valid){
            console.log('======= MESSAGE VALIDATION ERRORS: ======= ', validate.errors)
        }
    }


    exports.checkReserveNowReq = function (parsedMessage) {
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

        const validate = ajv.compile(ReserveNowReqSchema)
        const valid = validate(parsedMessage)

        console.log('!!!!!!!!MESSAGE: ', parsedMessage)
        console.log('RESULT IS VALID: ', valid)
        if(!valid){
            console.log('======= MESSAGE VALIDATION ERRORS: ======= ', validate.errors)
        }
    }

    exports.checkDataTransferReq = function (parsedMessage) {
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

        const validate = ajv.compile(dataTransferReqSchema)
        const valid = validate(parsedMessage)

        console.log('!!!!!!!!MESSAGE: ', parsedMessage)
        console.log('RESULT IS VALID: ', valid)
        if(!valid){
            console.log('======= MESSAGE VALIDATION ERRORS: ======= ', validate.errors)
        }
    }

    exports.checkMeterValuesReq = function (parsedMessage) {
        const meterValuesSchema = {
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
       

        const validate = ajv.compile(dataTransferConfSchema)
        const valid = validate(parsedMessage)

        console.log('!!!!!!!!MESSAGE: ', parsedMessage)
        console.log('RESULT IS VALID: ', valid)
        if(!valid){
            console.log('======= MESSAGE VALIDATION ERRORS: ======= ', validate.errors)
        }
    }

    exports.checkMeterValuesConf = function(){
        
    }

    handleError = function(error){
        if(error){
            errors.push(error)
        }
    }

    return exports
}