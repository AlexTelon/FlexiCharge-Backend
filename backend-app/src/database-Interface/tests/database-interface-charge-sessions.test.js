const { describe, expect, test } = require("@jest/globals");
const testContainer = require("../../testContainer")
const databaseInterfaceChargeSessions = testContainer.resolve("databaseInterfaceChargeSessions")

describe("Start a ChargeSession", () => {
    test("Start a ChargeSession", (done) => {
        const chargerID = 1
        const userID = 2
        const payNow = null
        const paymentDueDate = null
        const paymentMethod = null

        databaseInterfaceChargeSessions.startChargeSession(chargerID, userID, payNow, paymentDueDate, paymentMethod, (error, startedChargeSession) => {
            if (Object.keys(error).length > 0) {
                done(error);
                return;
            }

            expect(startedChargeSession.meterStart).toBe(1032)
            done()
        })
    });
});

describe("getChargeSession", () => {
    test("Get Charge Session with id 1", (done) => {
        databaseInterfaceChargeSessions.getChargeSession(1, (error, chargeSession) => {
            if (Object.keys(error).length > 0) {
                done(error);
                return;
            }

            expect(chargeSession.chargerID).toBe(100001)
            done()
        })
    });
});

describe("getChargeSessions", () => {
    test("Get all ChargeSessions", (done) => {
        databaseInterfaceChargeSessions.getChargeSessions(1, (error, chargeSessions) => {
            if (Object.keys(error).length > 0) {
                done(error);
                return;
            }

            expect(chargeSessions.length).toBe(1)
            done()
        })
    });
});


describe("updateChargingState", () => {
    test("Update ChargingState", (done) => {
        const currentChargePercentage = 10
        const kWhTransferred = 1026
        databaseInterfaceChargeSessions.updateChargingState(1, currentChargePercentage, kWhTransferred, (error, updatedChargeSession) => {
            if (Object.keys(error).length > 0) {
                done(error);
                return;
            }

            expect(updatedChargeSession.kWhTransferred).toBe(kWhTransferred)
            done()
        })
    });
});

describe("endChargeSession", () => {
    test("End ChargingSession", (done) => {
        databaseInterfaceChargeSessions.endChargeSession(1, (error, updatedChargeSession) => {
            if (Object.keys(error).length > 0) {
                done(error);
                return;
            }

            expect(updatedChargeSession.kWhTransferred).toBe(1.9) // This is gonna fail since endtime will always change.... need expect other thingy i think!
            done()
        })
    });
});

describe("calculateTotalChargePrice", () => {
    test("Calculate the total charge price", (done) => {
        databaseInterfaceChargeSessions.calculateTotalChargePrice(1, (error, totalChargePrice) => {
            if (Object.keys(error).length > 0) {
                done(error);
                return;
            }

            expect(totalChargePrice).toBe(3510)
            done()
        })
    });
});

describe("updateMeterStart", () => {
    test("Update meterStart", (done) => {
        const meterStart = 1337
        databaseInterfaceChargeSessions.updateMeterStart(1, meterStart, (error, updatedChargeSession) => {
            if (Object.keys(error).length > 0) {
                done(error);
                return;
            }

            expect(updatedChargeSession.meterStart).toBe(meterStart)
            done()
        })
    });
});

