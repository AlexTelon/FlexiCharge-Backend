const express = require("express");
const checkJwt = require("./middleware/jwt.middleware");

module.exports = function ({ databaseInterfaceInvoices }) {
  const router = express.Router();

  /**
   * Admin genereates an invoice. Dates should be a ISO-8601 strings; YYYY-MM-DD.
   *
   * Not implemented!!
   */
  router.post("/", checkJwt, function (req, res) {
    const { userID, dateStart, dateEnd } = req.body;

    res.status(201).json({
      statusCode: 201,
      message: "Resource was created",
      resourceID: "dummy",
    });
  });

  /**
   * Get a list of invoices for all users.
   * Filter options: date & status
   */
  router.get("/users", checkJwt, (req, res) => {
    const invoices = databaseInterfaceInvoices.getAllInvoices(
      req.user,
      req.query
    );
    res.status(200).json(invoices);
  });

  /**
   * Get a list of invoices for a specific user.
   * Filter options: status
   */
  router.get("/users/:userID", checkJwt, function (req, res) {
    const { userID } = req.params;

    const invoices = databaseInterfaceInvoices.getAllInvoicesByUserID(
      userID,
      req.user,
      req.query
    );
    res.status(200).json(invoices);
  });

  /**
   * Render invoice file.
   */
  router.get("/:invoiceID", (req, res) => {
    const { invoiceID } = req.params;

    const invoiceFile = databaseInterfaceInvoices.getInvoiceByID(invoiceID);
    invoiceFile.pipe(res);
  });

  return router;
};
