module.exports = function({}) {

    //Validation for name
    NAME_MIN_VALUE = 1
    NAME_MAX_VALUE = 30

    //Validation for address
    ADDRESS_MIN_VALUE = 1
    ADDRESS_MAX_VALUE = 30

    //Validation for location
    LONGITUDE_MIN_VALUE = -180
    LONGITUDE_MAX_VALUE = 180
    LATITUDE_MIN_VALUE = -90
    LATITUDE_MAX_VALUE = 90

    //Validation for price
    PRICE_MIN_VALUE = 1

    const exports = {}

    exports.chargerPointValidation = function(name, address, location, price) {

        const validationErrors = []

        if (name.length < NAME_MIN_VALUE || name.length > NAME_MAX_VALUE) {
            validationErrors.push("invalidName")
        }
        if (address.length < ADDRESS_MIN_VALUE || address.length > ADDRESS_MAX_VALUE) {
            validationErrors.push("invalidAddress")
        }
        if(location[0] < LATITUDE_MIN_VALUE || location[0] > LATITUDE_MAX_VALUE){
            validationErrors.push("invalidLatitude")
        }
        if(location[1] < LONGITUDE_MIN_VALUE || location[1] > LONGITUDE_MAX_VALUE){
            validationErrors.push("invalidLongitude")
        }
        if (price < PRICE_MIN_VALUE) {
            validationErrors.push("invalidPrice")
        }

        return validationErrors
    }

    return exports

}