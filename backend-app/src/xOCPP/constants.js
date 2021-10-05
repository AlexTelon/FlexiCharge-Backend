module.exports = function({}){

    exports.get = function() {
        
        const constants = {
            INVALID_ID: "InvalidId",
            SSB: 0,
            CHARGER_PLUS: 1,
            TEST1: 001,
            TEST2: 002,
            TEST3: 003,

            HEART_BEAT_INTERVALL: 86400, //24h
            RESERVATION_TIME: 15, //15sec

            CALL: 2,
            CALL_RESULT: 3,
            CALL_ERROR: 4,

            //Used in call and results, not in errors
            MESSAGE_TYPE_INDEX: 0,
            UNIQUE_ID_INDEX: 1,
            ACTION_INDEX: 2,
            PAYLOAD_INDEX: 3,

            BOOT_NOTIFICATION: "BootNotification",
            REMOTE_START_TRANSACTION: "RemoteStartTransaction",
            REMOTE_STOP_TRANSACTION: "RemoteStopTransaction",
            INTERNAL_ERROR: "InternalError",
            NOT_IMPLEMENTED: "NotImplemented",
            GENERIC_ERROR: "GenericError",
            SECURITY_ERROR: "SecurityError",
            RESERVE_NOW: "ReserveNow",

            //Possible status states a charger can have
            AVAILABLE: "Available",
            PREPARING: "Preparing",
            CHARGING: "Charging",
            SUSPENDEDEVSE: "SuspendedEVSE",
            SUSPENDEDEV: "SuspendedEV",
            FINISHING: "Finishing",
            RESERVED: "Reserved",
            UNAVAILBLE: "Unavailable",
            FAULTED: "Faulted",

            //Possible answers for ReservNow response
            ACCEPTED: "Accepted",
            FAULTED: "Faulted",
            OCCUPIED: "Occupied",
            REJECTED: "Rejected",
            UNAVAILABLE: "Unavailable"

            
        }

        return constants
    }



    return exports
}