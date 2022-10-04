const dateHelper = require("../helpers/date");

module.exports = () => {
  const exports = {};

  const invoiceStatusTypes = ["PAID", "UNPAID", "ALL"];

  exports.getInvoiceIDValidation = (invoiceID) => {
    const validationErrors = [];

    if (invoiceID === undefined || invoiceID === null) {
      validationErrors.push("invoiceIdMissing");
    }

    return validationErrors;
  };

  exports.getUserIDValidation = (userID) => {
    const validationErrors = [];

    if (userID === undefined || userID === null) {
      validationErrors.push("userIdMissing");
    }

    return validationErrors;
  };

  exports.getInvoiceStatusFilterValidation = (status) => {
    const validationErrors = [];

    // Optional filter
    if (
      (status !== undefined || status !== null) &&
      typeof status === "string" &&
      invoiceStatusTypes.includes(status.toUpperCase())
    ) {
      validationErrors.push("invalidStatus");
    }

    return validationErrors;
  };

  exports.getInvoiceDateFilterValidation = (date) => {
    const validationErrors = [];

    // Optional filter
    if (
      (date !== undefined || date !== null) &&
      !dateHelper.isValidDateFormatYearAndMonth(date) // YYYY-MM
    ) {
      validationErrors.push("invalidDateFormat");
    }
    return validationErrors;
  };

  exports.getInvoiceDateValidation = (dateFrom, dateTo) => {
    const validationErrors = [];

    if (dateFrom === undefined || dateFrom === null) {
      validationErrors.push("dateFromMissing");
    }
    if (dateTo === undefined || dateTo === null) {
      validationErrors.push("dateToMissing");
    }

    if (validationErrors.length == 0) {
      const dateFromTimestamp = dateHelper.convertToTimestamp(dateFrom);
      const dateToTimestamp = dateHelper.convertToTimestamp(dateTo);

      if (
        !dateHelper.isValidDate(dateFromTimestamp) ||
        !dateHelper.isValidDate(dateToTimestamp)
      ) {
        validationErrors.push("invalidDateFormat");
      } else if (dateFromTimestamp > dateToTimestamp) {
        validationErrors.push("dateFromGreaterThanDateTo");
      }
    }
    return validationErrors;
  };

  return exports;
};
