const utils = require("./utils/invoices");
const { BadRequestError, NotFoundError } = require("./error/error-types");
const mockData = require("./mock/invoices");

module.exports = function ({ invoicesValidation }) {
  const exports = {};

  // Cannot be implemented without a database
  exports.createUserInvoice = (userID, dateFrom, dateTo, userData) => {
    const validationErrors = [
      ...invoicesValidation.getInvoiceDateValidation(dateFrom, dateTo),
      ...invoicesValidation.getUserIDValidation(userID),
    ];

    if (validationErrors.length > 0)
      throw new BadRequestError(validationErrors);
  };

  exports.getInvoiceByID = (invoiceID, userData) => {
    const validationErrors =
      invoicesValidation.getInvoiceIDValidation(invoiceID);

    if (validationErrors.length > 0)
      throw new BadRequestError(validationErrors);

    const invoice = utils.generateMonthlyInvoicePDF(
      mockData.user,
      mockData.chargeSessions
    );
    if (!invoice) throw new NotFoundError();

    return invoice;
  };

  exports.getAllInvoices = (userData, filterOptions = {}) => {
    const { status, date } = filterOptions;

    const validationErrors = [
      ...invoicesValidation.getInvoiceDateFilterValidation(date),
      ...invoicesValidation.getInvoiceStatusFilterValidation(status),
    ];

    if (validationErrors.length > 0)
      throw new BadRequestError(validationErrors);

    return mockData.getAllInvoices();
  };

  exports.getAllInvoicesByUserID = (userID, userData, filterOptions = {}) => {
    const { status } = filterOptions;

    const validationErrors = [
      ...invoicesValidation.getUserIDValidation(userID),
      ...invoicesValidation.getInvoiceStatusFilterValidation(status),
    ];

    if (validationErrors.length > 0)
      throw new BadRequestError(validationErrors);

    return mockData.getAllInvoicesByUserID(userID);
  };

  return exports;
};
