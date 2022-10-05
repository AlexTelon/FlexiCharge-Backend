const { generateMonthlyInvoicePDF } = require("./utils/invoices")
const dummyData = require('./invoices-dummy-data')

module.exports = function({}) {
    const exports = {}

    exports.getInvoiceByID = (invoiceID, userData, callback) => {
        callback([], generateMonthlyInvoicePDF(dummyData.user, dummyData.chargeSessions))
    }

    return exports
}
