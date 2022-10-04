function getLocationValidationErrors(validationErrors, location) {
  if (location === undefined || location === null) {
    validationErrors.push("invalidLocation");
  } else {
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
}

module.exports = { getLocationValidationErrors };
