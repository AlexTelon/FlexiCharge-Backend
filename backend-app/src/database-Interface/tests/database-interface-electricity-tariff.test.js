const { describe, expect, test } = require("@jest/globals");
const testContainer = require("../../testContainer")
const databaseInterfaceElectricityTariffs = testContainer.resolve("databaseInterfaceElectricityTariffs")

describe("getElectricityTariffsOrderByDate", () => {
    test("Get all electricityTariffs, ordered by date", (done) => {
        databaseInterfaceElectricityTariffs.getElectricityTariffsOrderByDate((error, tariffs) => {
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
        databaseInterfaceElectricityTariffs.getCurrentElectricityTariff((error, tariffs) => {
            if (Object.keys(error).length > 0) {
                done(error);
                return;
            }

            expect(tariffs.price).toBe(3.51)
            done()
        })
    });
});
