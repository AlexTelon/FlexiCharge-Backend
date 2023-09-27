const { describe, expect, test } = require("@jest/globals");
const testContainer = require("../../testContainer")
const newDatabaseInterfaceKlarnaPayments = testContainer.resolve("newDatabaseInterfaceKlarnaPayments")

describe("getNewKlarnaPaymentSession", () => {
    test("getNewKlarnaPaymentSession", (done) => {
        newDatabaseInterfaceKlarnaPayments.getNewKlarnaPaymentSession(1, (error, klarnaPayment) => {
            if (Object.keys(error).length > 0) {
                done(error);
                return;
            }

            expect(klarnaPayment.session_id).toBe("fake_session_id")
            done()
        })
    });
});

describe("createKlarnaOrder", () => {
    test("Create new Klarna order", (done) => {
        newDatabaseInterfaceKlarnaPayments.createKlarnaOrder(1, "fake_authorization_token", (error, updatedKlarnaPayment) => {
            if (Object.keys(error).length > 0) {
                done(error);
                return;
            }

            expect(updatedKlarnaPayment.order_id).toBe("fake_order_id")
            done()
        })
    });
});

describe("finalizeKlarnaOrder", () => {
    test("Finalize living Klarna order", (done) => {
        newDatabaseInterfaceKlarnaPayments.finalizeKlarnaOrder(1, (error, transaction) => {
            if (Object.keys(error).length > 0) {
                done(error);
                return;
            }

            expect(transaction.isPaid).toBe(true)
            done()
        })
    });
});