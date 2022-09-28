const { generateMonthlyInvoicePDF } = require("./utils/invoices")

module.exports = function({ }) {
    const exports = {}

    exports.getUserMonthlyInvoice = () => {
        return generateMonthlyInvoicePDF
    }


    return exports
}