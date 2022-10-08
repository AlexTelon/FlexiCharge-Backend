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

describe("updateElectricityTariff", () => {
    test("Update electricityTariff", (done) => {
        const dateToday = new Date(new Date())
        const oldDate = null
        const newDate = dateToday
        newDatabaseInterfaceElectricityTariffs.updateElectricityTariff(oldDate, newDate, (error, tariffs) => {
            if (Object.keys(error).length > 0) {
                done(error);
                return;
            }

            expect(tariffs.newDate).toBe(newDate)
            done()
        })
    });
});

