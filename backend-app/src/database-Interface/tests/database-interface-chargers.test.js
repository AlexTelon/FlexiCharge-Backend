const { describe, expect, test } = require("@jest/globals");
const testContainer = require("../../testContainer")
const newDatabaseInterfaceChargers = testContainer.resolve("newDatabaseInterfaceChargers")

describe("getChargers", () => {
    test("Get all Chargers", (done) => {
        newDatabaseInterfaceChargers.getChargers((error, chargers) => {
            if (Object.keys(error).length > 0) {
                done(error);
                return;
            }

            expect(chargers.length).toBe(1)
            done()
        })
    });
});

describe("getCharger", () => {
    test("Get Charger", (done) => {
        newDatabaseInterfaceChargers.getCharger(1, (error, charger) => {
            if (Object.keys(error).length > 0) {
                done(error);
                return;
            }

            expect(charger.status).toBe("Available")
            done()
        })
    });
});

describe("getChargerBySerialNumber", () => {
    test("Get Charger by serial number", (done) => {
        const serialNumber = "321cba"
        newDatabaseInterfaceChargers.getChargerBySerialNumber(serialNumber, (error, charger) => {
            if (Object.keys(error).length > 0) {
                done(error);
                return;
            }

            expect(charger.serialNumber).toBe(serialNumber)
            done()
        })
    });
});

describe("getAvailableChargers", () => {
    test("Get all Chargers with status of 'Available'", (done) => {
        newDatabaseInterfaceChargers.getAvailableChargers((error, chargers) => {
            if (Object.keys(error).length > 0) {
                done(error);
                return;
            }

            expect(chargers.length).toBe(1)
            done()
        })
    });
});

describe("addCharger", () => {
    const chargePointID = 100001
    const serialNumber = "bca245"
    const coordinates = [23.12, 55.43]
    test("Get all Chargers with status of 'Available'", (done) => {
        newDatabaseInterfaceChargers.addCharger(chargePointID, serialNumber, coordinates, (error, charger) => {
            if (Object.keys(error).length > 0) {
                done(error);
                return;
            }

            expect(charger.serialNumber).toBe(serialNumber)
            done()
        })
    });
});

describe("removeCharger", () => {
    test("Remove Charger with id of 1", (done) => {
        newDatabaseInterfaceChargers.removeCharger(1, (error, didRemoveCharger) => {
            if (Object.keys(error).length > 0) {
                done(error);
                return;
            }

            expect(didRemoveCharger).toBe(true)
            done()
        })
    });
});

describe("updateChargerStatus", () => {
    test("Update status of a Charger", (done) => {
        newDatabaseInterfaceChargers.updateChargerStatus(1, "Reserved", (error, updatedCharger) => {
            if (Object.keys(error).length > 0) {
                done(error);
                return;
            }

            expect(updatedCharger.status).toBe("Reserved")
            done()
        })
    });
});

describe("getChargerForTransaction", () => {
    test("Get Charger for a transaction", (done) => {
        newDatabaseInterfaceChargers.getChargerForTransaction(1, (error, charger) => {
            if (Object.keys(error).length > 0) {
                done(error);
                return;
            }

            expect(charger.chargerID).toBe(100001)
            done()
        })
    });
});





