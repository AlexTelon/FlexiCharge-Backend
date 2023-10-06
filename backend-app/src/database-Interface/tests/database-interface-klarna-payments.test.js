const { describe, expect, test } = require("@jest/globals");
const testContainer = require("../../testContainer")
const databaseInterfaceKlarnaPayments = testContainer.resolve("databaseInterfaceKlarnaPayments")

describe("getNewKlarnaPaymentSession", () => {
    test("getNewKlarnaPaymentSession", (done) => {
        databaseInterfaceKlarnaPayments.getNewKlarnaPaymentSession(1, (error, klarnaPayment) => {
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
        databaseInterfaceKlarnaPayments.createKlarnaOrder(1, "fake_authorization_token", (error, updatedKlarnaPayment) => {
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
        databaseInterfaceKlarnaPayments.finalizeKlarnaOrder(1, (error, transaction) => {
            if (Object.keys(error).length > 0) {
                done(error);
                return;
            }

            expect(transaction.isPaid).toBe(true)
            done()
        })
    });
});