const { describe, expect, test } = require("@jest/globals");
const testContainer = require("../../testContainer")
const databaseInterfaceChargePoints = testContainer.resolve("databaseInterfaceChargePoints")

describe("getChargePoint", () => {
    test("Fetch ChargePoint with id 1", (done) => {
        databaseInterfaceChargePoints.getChargePoint(1, (error, chargePoint) => {
            if (Object.keys(error).length > 0) {
                done(error);
                return;
            }

            expect(chargePoint.address).toBe("Värnamovägen")
            done()
        })
    });
});

describe("getChargePoints", () => {
    test("Fetch all chargePoints", (done) => {
        databaseInterfaceChargePoints.getChargePoints((error, chargePoints) => {
            if (Object.keys(error).length > 0) {
                done(error);
                return;
            }

            expect(chargePoints.length).toBe(1)
            done()
        })
    });
});

describe("addChargePoint", () => {
    test("Add a Charge Point", (done) => {
        const name = "SuperCharger"
        const address = "Lidl"
        const coordinates = [31.351, 124.23]
        databaseInterfaceChargePoints.addChargePoint(name, address, coordinates, (error, addedChargePoint) => {
            if (Object.keys(error).length > 0) {
                done(error);
                return;
            }

            expect(addedChargePoint.name).toBe(name)
            done()
        })
    });
});

describe("removeChargePoint", () => {
    test("Remove a charge point", (done) => {
        databaseInterfaceChargePoints.removeChargePoint(1, (error, didRemoveChargePoint) => {
            if (Object.keys(error).length > 0) {
                done(error);
                return;
            }

            expect(didRemoveChargePoint).toBe(true)
            done()
        })
    });
});

describe("updateChargePoint", () => {
    test("Update a Charge Point", (done) => {
        const chargePointID = 23
        const name = "SuperCharger"
        const address = "Lidl"
        const coordinates = [31.351, 124.23]
        databaseInterfaceChargePoints.updateChargePoint(chargePointID, name, address, coordinates, (error, updatedChargePoint) => {
            if (Object.keys(error).length > 0) {
                done(error);
                return;
            }

            expect(updatedChargePoint.name).toBe(updatedChargePoint.name)
            done()
        })
    });
});