const { describe, expect, test } = require("@jest/globals");
const testContainer = require("../../testContainer")
const newDatabaseInterfaceElectricityTariffs = testContainer.resolve("newDatabaseInterfaceElectricityTariffs")

describe("getElectricityTariffsOrderByDate", () => {
    test("Get all electricityTariffs, ordered by date", (done) => {
        newDatabaseInterfaceElectricityTariffs.getElectricityTariffsOrderByDate((error, tariffs) => {
            if (Object.keys(error).length > 0) {
                done(error);
                return;
            }

            expect(tariffs.length).toBe(1)
            done()
        })
    });
});

describe("getCurrentElectricityTariff", () => {
    test("Get current electricityTariffs", (done) => {
        newDatabaseInterfaceElectricityTariffs.getCurrentElectricityTariff((error, tariffs) => {
            if (Object.keys(error).length > 0) {
                done(error);
                return;
            }

            expect(tariffs.price).toBe(3.51)
            done()
        })
    });
});
