module.exports = function({}) {


    //Validation for status
    STATUS_MIN_VALUE = 0,
    STATUS_MAX_VALUE = 3,
    //Validation for location
    LONGITUDE_MIN_VALUE = -180,
    LONGITUDE_MAX_VALUE = 180,
    LATITUDE_MIN_VALUE = -90,
    LATITUDE_MAX_VALUE = 90


    const exports = {}

    exports.getLocationValidation = function(location){
        
        const locationValidationErrors = []
 
        if(location[0] < LATITUDE_MIN_VALUE || location[0] > LATITUDE_MAX_VALUE){
            locationValidationErrors.push("invalidLatitude")
        }
        if(location[1] < LONGITUDE_MIN_VALUE || location[1] > LONGITUDE_MAX_VALUE){
            locationValidationErrors.push("invalidLongitude")
        }

        return locationValidationErrors
    }

    exports.getStatusValidation = function(status){
        const statusValidationErrors = []

        if(status < STATUS_MIN_VALUE || status > STATUS_MAX_VALUE){
            statusValidationErrors.push("invalidStatus")
        }   

        return statusValidationErrors
    }

    return exports

}