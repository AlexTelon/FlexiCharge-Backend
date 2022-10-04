//Validation for location
LONGITUDE_MIN_VALUE = -180
LONGITUDE_MAX_VALUE = 180
LATITUDE_MIN_VALUE = -90
LATITUDE_MAX_VALUE = 90

function getLocationValidationErrors(location) {
  const validationErrors = [];
  if (location === undefined || location === null) {
    validationErrors.push("invalidLocation");
  } else {
    if (location.length > 2){
      validationErrors.push('invalidLocationInput')
    }
    if (
      location instanceof Array == false ||
      typeof location[0] !== "number" ||
      typeof location[1] !== "number"
    ) {
      validationErrors.push("invalidDataType");
    }
    if (location[0] < LATITUDE_MIN_VALUE || location[0] > LATITUDE_MAX_VALUE) {
      validationErrors.push("invalidLatitude");
    }
    if (
      location[1] < LONGITUDE_MIN_VALUE ||
      location[1] > LONGITUDE_MAX_VALUE
    ) {
      validationErrors.push("invalidLongitude");
    }
  }
  return validationErrors;
}

module.exports = { getLocationValidationErrors };
