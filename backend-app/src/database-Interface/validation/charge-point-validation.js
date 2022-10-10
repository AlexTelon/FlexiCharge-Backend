const { getLocationValidationErrors } = require("./validation-helpers");
module.exports = function ({}) {
  //Validation for name
  NAME_MIN_VALUE = 1;
  NAME_MAX_VALUE = 30;

  //Validation for price
  PRICE_MIN_VALUE = 0;
  DEFAULT_RESERVATION_PRICE = 300;

  const exports = {};

  exports.chargePointValidation = function (
    name,
    location,
    price,
    klarnaReservationAmount
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

  return exports;
};
