const chargePointValidation = require("../validation/chargePointValidation")(
  {}
);
const { describe, expect, test } = require("@jest/globals");
const VALID_LONGITUDE = 120;
const VALID_LATITUDE = 20;
const VALID_LOCATION = [VALID_LATITUDE, VALID_LONGITUDE];

describe("Charge Point Validation with input:", () => {
  test("empty strings", () => {
    const errors = chargePointValidation.chargePointValidation("", "", "", "");
    expect(errors.length).toBe(3);
  });
  test("valid input", () => {
    const errors = chargePointValidation.chargePointValidation(
      "tst",
      VALID_LOCATION,
      2
    );
    expect(errors.length).toBe(0);
  });
  test("location array length 3", () => {
    const location = [20, 20, 20];
    const errors = chargePointValidation.chargePointValidation(
      "tst",
      location,
      2
    );
    expect(errors.length).toBe(1);
  });
  test("price null", () => {
    const errors = chargePointValidation.chargePointValidation(
      "tst",
      VALID_LOCATION,
      null
    );
    expect(errors.length).toBe(1);
  });
  test("price undefined", () => {
    const errors = chargePointValidation.chargePointValidation(
      "tst",
      VALID_LOCATION,
      undefined
    );
    expect(errors.length).toBe(1);
  });
  test("negative price", () => {
    const errors = chargePointValidation.chargePointValidation(
      "tst",
      VALID_LOCATION,
      -24
    );
    expect(errors.length).toBe(1);
  });
});
