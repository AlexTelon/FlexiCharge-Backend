module.exports = function({}){

    exports.get = function() {
        
        const constants = {
            INVALID_ID: "InvalidId",
            INVALID_CHARGE_POINT: "InvalidChargePoint",
            NO_TRANSACTION_ID: "NoTransactionId",
            NO_ACTIVE_TRANSACTION: "NoActiveTransaction",
            NOT_AN_ACTIVE_CONVERSATION: "NotAnActiveConversation",

            SSB: 0,
            CHARGER_PLUS: 1,
            TEST1: "FreeCharger",
            TEST2: "RemoteStart",
            TEST3: "RemoteStop",
            TEST4: "ReserveNow",

            ID_TAG: 1,
            CONNECTOR_ID: 1,
            TRANSACTION_ID: 78934,
            RESERVATION_ID: 34932,
            PARENT_ID_TAG: 89347,

            HEART_BEAT_INTERVALL: 86400, //24h
            RESERVATION_TIME: 300, //5min

            CALL: 2,
            CALL_RESULT: 3,
            CALL_ERROR: 4,

            //Used in call and results, not in errors
            MESSAGE_TYPE_INDEX: 0,
            UNIQUE_ID_INDEX: 1,
            ACTION_INDEX: 2,
            PAYLOAD_INDEX: 3,

            BOOT_NOTIFICATION: "BootNotification",
            STATUS_NOTIFICATION: "StatusNotification",
            REMOTE_START_TRANSACTION: "RemoteStartTransaction",
            REMOTE_STOP_TRANSACTION: "RemoteStopTransaction",
            INTERNAL_ERROR: "InternalError",
            NOT_IMPLEMENTED: "NotImplemented",
            GENERIC_ERROR: "GenericError",
            SECURITY_ERROR: "SecurityError",
            RESERVE_NOW: "ReserveNow",
            DATA_TRANSFER: "DataTransfer",
            START_TRANSACTION: "StartTransaction",
            STOP_TRANSACTION: "StopTransaction",
            
            
            CHARGE_LEVEL_UPDATE: "ChargeLevelUpdate",
            

            CURRENT_CHARGE_PERCENTAGE: "CurrentChargePercentage",
            KWH_TRANSFERRED: "kWhTransferred",

            //Possible answers for DataTransfer 
            ACCEPTED: "Accepted",
            REJECTED: "Rejected",
            UNKOWN_MESSAGE_ID :"UnknownMessageId",



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

            //Possible answers for ReserveNow response
            ACCEPTED: "Accepted",
            FAULTED: "Faulted",
            OCCUPIED: "Occupied",
            REJECTED: "Rejected",
            UNAVAILABLE: "Unavailable",

            //Charger error codes:
            CONNECTOR_LOCK_FAILURE: "ConnectorLockFailure",
            EV_COMMUNIATION_FAILURE: "EVCommunicationError",
            GROUND_FAILURE: "GroundFailure",
            HIGH_TEMP: "HighTemperature",
            INTERNAL_ERROR: "InternalError",
            LOCAL_LIST_CONFLICT: "LocalListConflict",
            NO_ERROR: "NoError",
            OTHER_ERROR: "OtherError",
            OVERCURRENT_FAILURE: "OverCurrentFailure",
            POWER_METER_FAILURE: "PowerMeterFailure",
            POWER_SWITCH_FAILURE: "PowerSwitchFailure",
            READER_FAILURE: "ReaderFailure",
            RESET_FAILURE: "ResetFailure",
            UNDERVOLTAGE: "UnderVoltage",
            OVERVOLTAGE: "OverVoltage",
            WEAK_SIGNAL: "WeakSignal"

            
        }

        return constants
    }



    return exports
}