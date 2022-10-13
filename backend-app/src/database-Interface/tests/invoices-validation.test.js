const invoicesValidation = require("../validation/invoices-validation")({});
const { describe, expect, test } = require("@jest/globals");

describe("Invoice ID is not empty", () => {
  test("null", () => {
    const errors = invoicesValidation.getInvoiceIDValidation(null);
    expect(errors.length).toEqual(1);
  });

  test("undefined", () => {
    const errors = invoicesValidation.getInvoiceIDValidation(undefined);
    expect(errors.length).toEqual(1);
  });
});

describe("User ID is not empty", () => {
  test("null", () => {
    const errors = invoicesValidation.getUserIDValidation(null);
    expect(errors.length).toEqual(1);
  });

  test("undefined", () => {
    const errors = invoicesValidation.getUserIDValidation(undefined);
    expect(errors.length).toEqual(1);
  });
});

describe("Invoice status optional filter", () => {
  test("Empty string or invalid invoice status", () => {
    const errors = invoicesValidation.getInvoiceStatusFilterValidation("");
    expect(errors.length).toEqual(1);
    expect(errors.includes("invalidStatus")).toBeTruthy();
  });

  test("Invoice status: PAID", () => {
    const errors = invoicesValidation.getInvoiceStatusFilterValidation("paid");
    expect(errors.length).toEqual(0);
  });

  test("Invoice status: UNPAID", () => {
    const errors =
      invoicesValidation.getInvoiceStatusFilterValidation("unpaid");
    expect(errors.length).toEqual(0);
  });

  test("Invoice status: ALL", () => {
    const errors = invoicesValidation.getInvoiceStatusFilterValidation("all");
    expect(errors.length).toEqual(0);
  });
});

describe("Invoice date optional filter", () => {
  test("Empty string", () => {
    const errors = invoicesValidation.getInvoiceDateFilterValidation("");
    expect(errors.length).toEqual(1);
  });

  test("YYYY-MM-DD date format", () => {
    const errors =
      invoicesValidation.getInvoiceDateFilterValidation("2022-10-11");
    expect(errors.length).toEqual(1);
  });

  test("YYYY-MM date format", () => {
    const errors = invoicesValidation.getInvoiceDateFilterValidation("2022-10");
    expect(errors.length).toEqual(0);
  });

  test("Invalid date", () => {
    const errors = [
      ...invoicesValidation.getInvoiceDateFilterValidation("2022-MM"),
      ...invoicesValidation.getInvoiceDateFilterValidation("YYYY-10"),
    ];
    expect(errors.length).toEqual(2);
  });
});

describe("Invoice date", () => {
  test("null dateFrom", () => {
    const errors = invoicesValidation.getInvoiceDateValidation(null, "");
    expect(errors.length).toEqual(1);
  });

  test("undefined dateFrom", () => {
    const errors = invoicesValidation.getInvoiceDateValidation(undefined, "");
    expect(errors.length).toEqual(1);
  });

  test("null dateTo", () => {
    const errors = invoicesValidation.getInvoiceDateValidation("", null);
    expect(errors.length).toEqual(1);
  });

  test("undefined dateTo", () => {
    const errors = invoicesValidation.getInvoiceDateValidation("", undefined);
    expect(errors.length).toEqual(1);
  });

  test("null dateFrom & dateTo", () => {
    const errors = invoicesValidation.getInvoiceDateValidation(null, null);
    expect(errors.length).toEqual(2);
  });

  test("undefined dateFrom & dateTo", () => {
    const errors = invoicesValidation.getInvoiceDateValidation(
      undefined,
      undefined
    );
    expect(errors.length).toEqual(2);
  });

  test("undefined dateFrom & dateTo", () => {
    const errors = invoicesValidation.getInvoiceDateValidation(
      undefined,
      undefined
    );
    expect(errors.length).toEqual(2);
  });

  test("Invalid date dateFrom", () => {
    const errors = invoicesValidation.getInvoiceDateValidation(
      "2022-MM-11",
      "2022-10-11"
    );
    expect(errors.length).toEqual(1);
  });

  test("Invalid date dateTo", () => {
    const errors = invoicesValidation.getInvoiceDateValidation(
      "2022-10-11",
      "2022-MM-DD"
    );
    expect(errors.length).toEqual(1);
  });

  test("Invalid date dateFrom & dateTo", () => {
    const errors = invoicesValidation.getInvoiceDateValidation(
      "2022-MM-DD",
      "2022-MM-DD"
    );
    expect(errors.length).toEqual(1);
  });

  test("dateFrom greater than dateTo", () => {
    const errors = invoicesValidation.getInvoiceDateValidation(
      "2022-10-12",
      "2022-10-11"
    );
    expect(errors.length).toEqual(1);
    expect(errors.includes("dateFromGreaterThanDateTo")).toBeTruthy();
  });

  test("Valid date format", () => {
    const errors = invoicesValidation.getInvoiceDateValidation(
      "2022-10-11",
      "2022-11-11"
    );
    expect(errors.length).toEqual(0);
  });
});
