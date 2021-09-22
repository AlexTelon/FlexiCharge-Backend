module.exports = function({}){

    exports.getConstants = function() {
        
        const constants = {
            CALL: 2,
            CALLRESULT: 3,
            CALLERROR: 4,
            connectedChargers: [],
            chargerSerials: []
        }

        return constants
    }



    return exports
}