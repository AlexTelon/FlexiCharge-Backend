module.exports = function({}){

    exports.get = function() {
        
        const constants = {
            INVALID_ID: "invalidId",
            BAD_REQUEST: "badRequest",
            TEST: 1,

            CALL: 2,
            CALL_RESULT: 3,
            CALL_ERROR: 4,
            BOOT_NOTIFICATION: "BootNotification",
            START_TRANSACTION: "startTransaction",
            STOP_TRANSACTION: "stopTransaction",
            HEART_BEAT_INTERVALL: 86400,
            INTERNAL_ERROR: "InternalError",
            NOT_IMPLEMENTED: "NotImplemented",
            GENERIC_ERROR: "GenericError",
            SECURITY_ERROR: "SecurityError",
            RESERVE_NOW: "ReserveNow",
            ACCEPTED: "Accepted"
            
        }

        return constants
    }



    return exports
}