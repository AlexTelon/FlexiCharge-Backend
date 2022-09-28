module.exports = function({}) {

    //Validation for name
    NAME_MIN_VALUE = 1
    NAME_MAX_VALUE = 30

    //Validation for location
    LONGITUDE_MIN_VALUE = -180
    LONGITUDE_MAX_VALUE = 180
    LATITUDE_MIN_VALUE = -90
    LATITUDE_MAX_VALUE = 90

    //Validation for price
    PRICE_MIN_VALUE = 0
    DEFAULT_RESERVATION_PRICE = 300

    const exports = {}

    exports.chargePointValidation = function(name, location, price, klarnaReservationAmount) {

        const validationErrors = []
        if (name === undefined) {
            validationErrors.push("invalidName")
        } else {
            if (typeof name !== 'string') {
                validationErrors.push("invalidDataType")
            }
            if (name.length < NAME_MIN_VALUE || name.length > NAME_MAX_VALUE) {
                validationErrors.push("invalidName")
            }
        }
        if (location === undefined) {
            validationErrors.push("invalidLocation")
        } else {
            if ((location instanceof Array) == false || (typeof location[0] !== 'number') || (typeof location[1] !== 'number')) {
                validationErrors.push("invalidDataType")
            }
            if (location[0] < LATITUDE_MIN_VALUE || location[0] > LATITUDE_MAX_VALUE) {
                validationErrors.push("invalidLatitude")
            }
            if (location[1] < LONGITUDE_MIN_VALUE || location[1] > LONGITUDE_MAX_VALUE) {
                validationErrors.push("invalidLongitude")
            }
        }
        if (price === undefined) {
            validationErrors.push("invalidPrice")
        } else {
            if (typeof price !== 'number') {
                validationErrors.push("invalidDataType")
            }
            if (price < PRICE_MIN_VALUE) {
                validationErrors.push("invalidPrice")
            }
        }


        return validationErrors
    }

    return exports

}