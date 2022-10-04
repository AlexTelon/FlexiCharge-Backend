module.exports = () => {
  const exports = {};

  const invoiceStatusTypes = ["PAID", "UNPAID", "ALL"];

  const isDateFormatValid = (date) => {
    // Date Fromat: YYYY-MM
    const invoiceDate = date.split("-");
    const months = [
      "01",
      "02",
      "03",
      "04",
      "05",
      "06",
      "07",
      "08",
      "09",
      "10",
      "11",
      "12",
    ];

    return (
      invoiceDate.at(0).length === 4 &&
      invoiceDate.at(0).match(/^[0-9]+$/) != null &&
      months.includes(invoiceDate.at(1))
    );
  };

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

  exports.getInvoiceStatusValidation = (status) => {
    const validationErrors = [];

    // Optional filter
    if (
      (status !== undefined || status !== null) &&
      invoiceStatusTypes.includes(status.toUpperCase())
    ) {
      validationErrors.push("invalidStatus");
    }

    return validationErrors;
  };

  exports.getInvoiceDateValidation = (date) => {
    
    const validationErrors = [];

    // Optional filter
    if ((date !== undefined || date !== null) && !isDateFormatValid(date)) {
      validationErrors.push("invalidStatus");
    }
    return validationErrors;
  };

  return exports;
};
