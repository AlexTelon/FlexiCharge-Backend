module.exports = function ({}) {
  //Validation for Start
  START_MIN_VALUE = Math.floor(Date.now() / 1000);
  END_MIN_VALUE = START_MIN_VALUE + 1;

  const exports = {};

  exports.getAddReservationValidation = function (start, end) {
    const validationErrors = [];
    if (start == undefined || start == null) {
      validationErrors.push("invalidStartValue");
    } else {
      if (typeof start !== "number") {
        validationErrors.push("invalidStartValue");
      }
    }
    if (end == undefined || end == null) {
      validationErrors.push("invalidEndValue");
    } else {
      if (typeof end !== "number") validationErrors.push("invalidEndValue");
    }
    if (start <= START_MIN_VALUE) {
      validationErrors.push("invalidStartValue");
    }
    if (end <= END_MIN_VALUE) {
      validationErrors.push("invalidEndValue");
    }
    if (end < start) {
      validationErrors.push("startGreaterThenEnd");
    }

    return validationErrors;
  };

  return exports;
};
