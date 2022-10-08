const { describe, expect, test } = require("@jest/globals");
const testContainer = require("../../testContainer")
const newDatabaseInterfaceReservations = testContainer.resolve("newDatabaseInterfaceReservations")

describe("getReservation", () => {
    test("Get all Chargers", (done) => {
        newDatabaseInterfaceReservations.getReservation(1, (error, reservation) => {
            if (Object.keys(error).length > 0) {
                done(error);
                return;
            }

            expect(reservation.userID).toBe(1337)
            done()
        })
    });
});

describe("getReservationsForCharger", () => {
    test("Get reservations for a charger", (done) => {
        newDatabaseInterfaceReservations.getReservationsForCharger(1, (error, reservations) => {
            if (Object.keys(error).length > 0) {
                done(error);
                return;
            }

            expect(reservations.length).toBe(1)
            done()
        })
    });
});

describe("getReservationsForUser", () => {
    test("Get reservations for a user", (done) => {
        newDatabaseInterfaceReservations.getReservationsForUser(1, (error, reservations) => {
            if (Object.keys(error).length > 0) {
                done(error);
                return;
            }

            expect(reservations.length).toBe(1)
            done()
        })
    });
});

describe("addReservation", () => {
    test("Add a reservation", (done) => {
        const chargerID = 100001
        const userID = 1335
        const start = 55
        const end = 99
        newDatabaseInterfaceReservations.addReservation(chargerID, userID, start, end, (error, reservation) => {
            if (Object.keys(error).length > 0) {
                done(error);
                return;
            }

            expect(reservation.userID).toBe(userID)
            done()
        })
    });
});

describe("removeReservation", () => {
    test("Remove a reservation", (done) => {
        newDatabaseInterfaceReservations.removeReservation(1, (error, didRemoveReservation) => {
            if (Object.keys(error).length > 0) {
                done(error);
                return;
            }

            expect(didRemoveReservation).toBe(true)
            done()
        })
    });
});
