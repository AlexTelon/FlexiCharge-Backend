const { generateMonthlyInvoicePDF } = require("./utils/invoices");
const dummyData = require("./invoices-dummy-data");
const { BadRequestError } = require("./error/error-types");

module.exports = function ({ invoicesValidation }) {
  const exports = {};

  exports.createUserInvoice = (userID, dateFrom, dateTo, userData) => {
    const validationErrors = [
      ...invoicesValidation.getInvoiceDateValidation(dateFrom, dateTo),
      ...invoicesValidation.getUserIDValidation(userID),
    ];

    if (validationErrors.length > 0)
      throw new BadRequestError(validationErrors);
  };

  exports.getInvoiceByID = (invoiceID, userData, callback) => {
    const validationErrors =
      invoicesValidation.getInvoiceIDValidation(invoiceID);

    if (validationErrors.length > 0)
      throw new BadRequestError(validationErrors);

    callback(
      [],
      generateMonthlyInvoicePDF(dummyData.user, dummyData.chargeSessions)
    );
  };

  exports.getAllInvoices = async (userData, filterOptions = {}) => {
    const { status, date } = filterOptions;

    const validationErrors = [
      ...invoicesValidation.getInvoiceDateFilterValidation(date),
      ...invoicesValidation.getInvoiceStatusFilterValidation(status),
    ];

    if (validationErrors.length > 0)
      throw new BadRequestError(validationErrors);
  };

  exports.getAllInvoicesByUserID = (userID, userData, filterOptions = {}) => {
    const { status } = filterOptions;

    const validationErrors = [
      ...invoicesValidation.getUserIDValidation(userID),
      ...invoicesValidation.getInvoiceStatusFilterValidation(status),
    ];

    if (validationErrors.length > 0)
      throw new BadRequestError(validationErrors);
  };

  return exports;
};
