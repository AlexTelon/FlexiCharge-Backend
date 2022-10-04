const { generateMonthlyInvoicePDF } = require("./utils/invoices");
const dummyData = require("./invoices-dummy-data");
const { NotFoundError } = require("./error/error-types");

module.exports = function ({ invoicesValidation }) {
  const exports = {};

  exports.getInvoiceByID = (invoiceID, userData, callback) => {
    const validationErrors = invoicesValidation.getInvoiceIDValidation(invoiceID);

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
  };

  exports.getAllInvoicesByUserID = (userID, userData, filterOptions = {}) => {
    const { status } = filterOptions;

    const validationErrors = [
      ...invoicesValidation.getUserIDValidation(userID),
      ...invoicesValidation.getInvoiceStatusFilterValidation(status),
    ];

    throw new NotFoundError()
  };

  return exports;
};
