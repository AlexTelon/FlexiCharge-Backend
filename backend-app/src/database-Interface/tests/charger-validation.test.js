const chargerValidation = require("../validation/charger-validation")({});
const { describe, expect, test } = require("@jest/globals");
const VALID_LONGITUDE = 120;
const VALID_LATITUDE = 20;

describe("Charger By SerialNumber Validation", () => {
  test("should return an error when input is an empty string", () => {
    const errors = chargerValidation.getChargerBySerialNumberValidation("");
    expect(errors.length).toBe(1);
  });

  test("should return an error when input is null", () => {
    const errors = chargerValidation.getChargerBySerialNumberValidation(null);
    expect(errors.length).toBe(1);
  });

  test("should return an error when input is undefined", () => {
    const valErrors =
      chargerValidation.getChargerBySerialNumberValidation(undefined);
    expect(valErrors.length).toBe(1);
  });

  test("should return an error when input is an integer", () => {
    const errors = chargerValidation.getChargerBySerialNumberValidation(1);
    expect(errors.length).toBe(1);
  });

  test("should return an error when input is a float", () => {
    const errors = chargerValidation.getChargerBySerialNumberValidation(11.11);
    expect(errors.length).toBe(1);
  });

  test("should return an error when input is a long string", () => {
    const errors = chargerValidation.getChargerBySerialNumberValidation(
      "ashdfjasdfj;laksdjflkasjdf;lkjsalkdfjlkajdfljadhfaoiuwoejasklflha;sjdsljdfasdfhjalshdfkja"
    );
    expect(errors.length).toBe(1);
  });
});

describe("Add Charger Validation", () => {
  test("should return errors when all inputs are undefined", () => {
    const errors = chargerValidation.getAddChargerValidation(
      undefined,
      undefined,
      undefined
    );
    expect(errors.length).toBe(3);
  });

  test("should return errors when all inputs are null", () => {
    const errors = chargerValidation.getAddChargerValidation(null, null, null);
    expect(errors.length).toBe(3);
  });

  test("should return errors when all inputs are empty strings", () => {
    const errors = chargerValidation.getAddChargerValidation("", "", "");
    expect(errors.length).toBe(3);
  });

  test("should return errors when location is an array of strings", () => {
    const location = ["123", "213"];
    const errors = chargerValidation.getAddChargerValidation(
      location,
      "serialNumber",
      1
    );
    expect(errors.length).toBe(3);
  });

  test("should not return errors when input is valid", () => {
    const location = [VALID_LATITUDE, VALID_LONGITUDE];
    const errors = chargerValidation.getAddChargerValidation(
      location,
      "serialNumber",
      1
    );
    expect(errors.length).toBe(0);
  });

  test("should return errors when location is an array of integers and strings", () => {
    const location = [VALID_LATITUDE, "213"];
    const errors = chargerValidation.getAddChargerValidation(
      location,
      "serialNumber",
      1
    );
    expect(errors.length).toBe(2);
  });

  test("should return an error when location array has length 3", () => {
    const location = [12, 12, 12];
    const errors = chargerValidation.getAddChargerValidation(
      location,
      "serialNumber",
      1
    );
    expect(errors.length).toBe(1);
  });

  test("should return an error when location array has length 1", () => {
    const location = [12];
    const errors = chargerValidation.getAddChargerValidation(
      location,
      "serialNumber",
      1
    );
    expect(errors.length).toBe(1);
  });
});

describe("Update Charger Status Validation", () => {
  test("should return an error when input is null", () => {
    const errors = chargerValidation.getUpdateChargerStatusValidation(null);
    expect(errors.length).toBe(1);
  });

  test("should return an error when input is undefined", () => {
    const errors =
      chargerValidation.getUpdateChargerStatusValidation(undefined);
    expect(errors.length).toBe(1);
  });

  test("should return an error when input is an empty string", () => {
    const errors = chargerValidation.getUpdateChargerStatusValidation("");
    expect(errors.length).toBe(1);
  });

  test("should not return an error when input is 'Available'", () => {
    const errors =
      chargerValidation.getUpdateChargerStatusValidation("Available");
    expect(errors.length).toBe(0);
  });

  test("should return an error when input is 'Availableqweqwe'", () => {
    const errors =
      chargerValidation.getUpdateChargerStatusValidation("Availableqweqwe");
    expect(errors.length).toBe(1);
  });

  test("should return an error when input is 'Available qweqwe'", () => {
    const errors =
      chargerValidation.getUpdateChargerStatusValidation("Available qweqwe");
    expect(errors.length).toBe(1);
  });

  test("should return errors when input is an integer", () => {
    const errors = chargerValidation.getUpdateChargerStatusValidation(123);
    expect(errors.length).toBe(2);
  });
});