const chargePointValidation = require("../validation/chargePointValidation")({});
const { describe, expect, test } = require("@jest/globals");
const VALID_LONGITUDE = 120;
const VALID_LATITUDE = 20;

describe("Charge Point Validation with input:", () => {
  test("empty strings", () => {
    const errors = chargePointValidation.chargePointValidation("", "", "", "");
    expect(errors.length).toBe(3);
  });
  test("valid input", () => {
    const location = [VALID_LATITUDE, VALID_LONGITUDE]
    const errors = chargePointValidation.chargePointValidation("tst", location, 2);
    expect(errors.length).toBe(0);
  });
  test("location array length 3", () => {
    const location = [VALID_LATITUDE, VALID_LONGITUDE, 123]
    const errors = chargePointValidation.chargePointValidation("tst", location, 2);
    expect(errors.length).toBe(1);
  });
});
