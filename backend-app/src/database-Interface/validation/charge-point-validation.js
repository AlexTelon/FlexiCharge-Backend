const { getLocationValidationErrors } = require("./validation-helpers");

module.exports = function({}) {

    //Validation for name
    NAME_MIN_VALUE = 1
    NAME_MAX_VALUE = 30

    //Validation for price
    PRICE_MIN_VALUE = 0;

    //Validation for coordinates
    LONGITUDE_MIN_VALUE = -180
    LONGITUDE_MAX_VALUE = 180
    LATITUDE_MIN_VALUE = -90
    LATITUDE_MAX_VALUE = 90

    //Validation for address
    ADDRESS_MIN_VALUE = 3
    ADDRESS_MAX_VALUE = 255

    const exports = {}

    exports.chargePointValidation = function (
        name,
        location,
        price
      ) {
        const validationErrors = [...getLocationValidationErrors(location)];
        if (name === undefined) {
          validationErrors.push("invalidName");
        } else {
          if (typeof name !== "string") {
            validationErrors.push("invalidDataType");
          }
          if (name.length < NAME_MIN_VALUE || name.length > NAME_MAX_VALUE) {
            validationErrors.push("invalidName");
          }
        }
        if (price === undefined) {
          validationErrors.push("invalidPrice");
        } else {
          if (typeof price !== "number") {
            validationErrors.push("invalidDataType");
          }
          if (price < PRICE_MIN_VALUE) {
            validationErrors.push("invalidPrice");
          }
        }
    
        return validationErrors;
      };

    exports.getChargePointValidation = function(chargePointID){
        const validationErrors = []

        if(chargePointID == null || chargePointID == undefined){
            validationErrors.push("invalidChargePointID")
        }

        return validationErrors
    }

    exports.getAddChargePointValidation = function(name, address, coordinates) {
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
        if (coordinates === undefined) {
            validationErrors.push("invalidcoordinates")
        } else {
            if ((coordinates instanceof Array) == false || (typeof coordinates[0] !== 'number') || (typeof coordinates[1] !== 'number')) {
                validationErrors.push("invalidDataType")
            }
            if (coordinates[0] < LATITUDE_MIN_VALUE || coordinates[0] > LATITUDE_MAX_VALUE) {
                validationErrors.push("invalidLatitude")
            }
            if (coordinates[1] < LONGITUDE_MIN_VALUE || coordinates[1] > LONGITUDE_MAX_VALUE) {
                validationErrors.push("invalidLongitude")
            }
        }
        
        if (address === undefined) {
            validationErrors.push("invalidAddress")
        } else {
            if(typeof address !== 'string'){
                validationErrors.push("invalidDataType")
            }
            if(address.length < ADDRESS_MIN_VALUE || address.length > ADDRESS_MAX_VALUE){
                validationErrors.push("invalidAddress")
            }
        }

        return validationErrors
    }

    exports.getRemoveChargePointValidation = function(chargePointID){
        const validationErrors = []

        if(chargePointID == null || chargePointID == undefined){
            validationErrors.push("invalidChargePointID")
        }

        return validationErrors
    }

    return exports

}