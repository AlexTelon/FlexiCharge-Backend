module.exports = function({}){

    exports.getMessageTypeID = function() {
        
        const messageTypeID = {
            CALL: 2,
            CALLRESULT: 3,
            CALLERROR: 4
        }

        return messageTypeID
    }



    return exports
}