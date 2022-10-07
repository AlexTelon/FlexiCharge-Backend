const { describe, expect, test } = require("@jest/globals");

const testContainer = require("../../testContainer")

const newDatabaseInterfaceChargePoints = testContainer.resolve("newDatabaseInterfaceChargePoints")


describe("GetChargePoint", () => {
    test("Fetch ChargePoint with id 1, which should exist", (done) =>  {
        newDatabaseInterfaceChargePoints.getChargePoint(1, null, (error, chargePoint) => {
            if (Object.keys(error).length > 0) {
                done(error);
                return;
            }

            console.log(chargePoint.id)
            expect(chargePoint.address).toBe("Värnamovägen")
            done()
        })
    });
  });