const { describe, expect, test } = require("@jest/globals");
const testContainer = require("../../testContainer")
const databaseInterfaceTransactions = testContainer.resolve("databaseInterfaceTransactions")

describe("addTransaction", () => {
    test("Add a transaction", (done) => {
        const chargeSessionID = 1
        const connectorID = 100_000
        const userID = 12
        const payNow = false
        const paymentDueDate = null
        const paymentMethod = null
        const totalPrice = null
        databaseInterfaceTransactions.addTransaction(chargeSessionID, userID, connectorID, payNow, paymentDueDate, paymentMethod, totalPrice, (error, transaction) => {
            if (Object.keys(error).length > 0) {
                done(error);
                return;
            }

            expect(transaction.userID).toBe(userID)
            done()
        })
    });
});

describe("getTransaction", () => {
    test("Get transaction", (done) => {
        databaseInterfaceTransactions.getTransaction(1, (error, transaction) => {
            if (Object.keys(error).length > 0) {
                done(error);
                return;
            }

            expect(transaction.paymentMethod).toBe("Klarna")
            done()
        })
    });
});

describe("getTransactionsForUser", () => {
    test("Get Transactions for a user", (done) => {
        databaseInterfaceTransactions.getTransactionsForUser(12, (error, transaction) => {
            if (Object.keys(error).length > 0) {
                done(error);
                return;
            }

            expect(transaction.length).toBe(1)
            done()
        })
    });
});

describe("updatePaymentMethod", () => {
    test("Update payment method for Transaction", (done) => {
        const paymentMethod = "Klarna"
        databaseInterfaceTransactions.updatePaymentMethod(1, paymentMethod, (error, updatedTransaction) => {
            if (Object.keys(error).length > 0) {
                done(error);
                return;
            }

            expect(updatedTransaction.paymentMethod).toBe(paymentMethod)
            done()
        })
    });
});

describe("updatepaidDate", () => {
    test("Update paidDate for Transaction", (done) => {
        const paidDate = new Date(new Date())
        databaseInterfaceTransactions.updatepaidDate(1, paidDate, (error, updatedTransaction) => {
            if (Object.keys(error).length > 0) {
                done(error);
                return;
            }

            expect(updatedTransaction.paidDate).toBe(paidDate)
            done()
        })
    });
});

describe("updateTotalPrice", () => {
    test("Update totalPrice for Transaction", (done) => {
        const totalPrice = 255
        databaseInterfaceTransactions.updateTotalPrice(1, totalPrice, (error, updatedTransaction) => {
            if (Object.keys(error).length > 0) {
                done(error);
                return;
            }

            expect(updatedTransaction.totalPrice).toBe(totalPrice)
            done()
        })
    });
});

describe("getTransactionsForCharger", () => {
    test("Get all transactions for a charger", (done) => {
        const totalPrice = 255
        databaseInterfaceTransactions.getTransactionsForCharger(1, (error, transactions) => {
            if (Object.keys(error).length > 0) {
                done(error);
                return;
            }

            expect(transactions.length).toBe(1)
            done()
        })
    });
});

describe("getTransactionForChargeSession", () => {
    test("Get transaction for a charge session", (done) => {
        databaseInterfaceTransactions.getTransactionForChargeSession(2, (error, transaction) => {
            if (Object.keys(error).length > 0) {
                done(error);
                return;
            }

            expect(transaction.transactionID).toBe(1)
            done()
        })
    });
});