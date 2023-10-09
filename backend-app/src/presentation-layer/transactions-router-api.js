var express = require("express");

module.exports = function ({ databaseInterfaceTransactions }) {
  function getMockTransaction() {
    return {
      transactionID: 9999,
      isKlarnaPayment: true,
      kwhTransfered: Math.floor(Math.random() * 100) + 1, // Random number between 0 and 100
      currentChargePercentage: Math.floor(Math.random() * 101), // Random number between 0 and 100
      pricePerKwh: (Math.random() * 100).toFixed(2), // Random number between 0 and 100 with 2 decimal places
      timestamp: Date.now(),
      paymentID: null,
      userID: "1",
      session_id: null,
      klarna_consumer_token:
        "eyJhbGciOiJSUzI1NiIsImtpZCI6IjgyMzA1ZWJjLWI4MTEtMzYzNy1hYTRjLTY2ZWNhMTg3NGYzZCJ9.eyJzZXNzaW9uX2lkIjoiNjRiY2VhZGEtODZmZC01ODkxLTg3ZTYtNDAxYWY2YWJhODNjIiwiYmFzZV91cmwiOiJodHRwczovL2pzLnBsYXlncm91bmQua2xhcm5hLmNvbS9ldS9rcCIsImRlc2lnbiI6ImtsYXJuYSIsImxhbmd1YWdlIjoic3YiLCJwdXJjaGFzZV9jb3VudHJ5IjoiU0UiLCJlbnZpcm9ubWVudCI6InBsYXlncm91bmQiLCJtZXJjaGFudF9uYW1lIjoiWW91ciBidXNpbmVzcyBuYW1lIiwic2Vzc2lvbl90eXBlIjoiUEFZTUVOVFMiLCJjbGllbnRfZXZlbnRfYmFzZV91cmwiOiJodHRwczovL2V1LnBsYXlncm91bmQua2xhcm5hZXZ0LmNvbSIsInNjaGVtZSI6dHJ1ZSwiZXhwZXJpbWVudHMiOlt7Im5hbWUiOiJrcGMtMWstc2VydmljZSIsInZhcmlhdGUiOiJ2YXJpYXRlLTEifSx7Im5hbWUiOiJrcC1jbGllbnQtdXRvcGlhLWZsb3ciLCJ2YXJpYXRlIjoidmFyaWF0ZS0xIn0seyJuYW1lIjoia3BjLVBTRUwtMzA5OSIsInZhcmlhdGUiOiJ2YXJpYXRlLTEifSx7Im5hbWUiOiJrcC1jbGllbnQtdXRvcGlhLXBvcHVwLXJldHJpYWJsZSIsInZhcmlhdGUiOiJ2YXJpYXRlLTEifSx7Im5hbWUiOiJrcC1jbGllbnQtdXRvcGlhLXN0YXRpYy13aWRnZXQiLCJ2YXJpYXRlIjoiaW5kZXgiLCJwYXJhbWV0ZXJzIjp7ImR5bmFtaWMiOiJ0cnVlIn19LHsibmFtZSI6ImtwLWNsaWVudC1vbmUtcHVyY2hhc2UtZmxvdyIsInZhcmlhdGUiOiJ2YXJpYXRlLTEifSx7Im5hbWUiOiJpbi1hcHAtc2RrLW5ldy1pbnRlcm5hbC1icm93c2VyIiwicGFyYW1ldGVycyI6eyJ2YXJpYXRlX2lkIjoibmV3LWludGVybmFsLWJyb3dzZXItZW5hYmxlIn19LHsibmFtZSI6ImtwLWNsaWVudC11dG9waWEtc2RrLWZsb3ciLCJ2YXJpYXRlIjoidmFyaWF0ZS0xIn0seyJuYW1lIjoia3AtY2xpZW50LXV0b3BpYS13ZWJ2aWV3LWZsb3ciLCJ2YXJpYXRlIjoidmFyaWF0ZS0xIn0seyJuYW1lIjoiaW4tYXBwLXNkay1jYXJkLXNjYW5uaW5nIiwicGFyYW1ldGVycyI6eyJ2YXJpYXRlX2lkIjoiY2FyZC1zY2FubmluZy1lbmFibGUifX1dLCJyZWdpb24iOiJldSIsIm9yZGVyX2Ftb3VudCI6NTAwMDAsIm9mZmVyaW5nX29wdHMiOjIsIm9vIjoiYmEiLCJ2ZXJzaW9uIjoidjEuMTAuMC0xNTkwLWczZWJjMzkwNyJ9.hXs1xp8yXOZNQnA9HTMYKuhGZXqsf4Vv9I5VRu-t6vQeJPxyVDBw-yqQ8cPq_lsDEMEZK5yuqRsm2CdttsM5iwF5Yea9IO5MevFUm-ryrr27zk1dJEaJfHAKQZ04VCsGp2ZeIqASsEr1mAUAOnaWuD-XZgy9D01DveMP1gS2lnYNlGfT7IpUs96RvG_PJyFfUn8EzSGQiIiIpeyjpZsC9fGxiY80ekoZgEML_Vsn1_jLWk-bHxi5KPlTblR_-5ys-_AUOeD9nPMT7bjrSUMZrXx3Md_EMOEMJwKZA7C25erPLr-P7k8iz9YNvtFE58bSwojDnUKBTMSsPD2CUGIk6Q",
      paymentConfirmed: true,
      meterStart: 1,
      connectorID: 100000,
    };
  }

  const router = express.Router();

  router.post("/", function (request, response) {
    console.log("Entering Post transactions");
    const { userID, connectorID, isKlarnaPayment, pricePerKwh } = request.body;

    if (connectorID == 100000) {
      const data = getMockTransaction();
      databaseInterfaceTransactions.getNewKlarnaPaymentSession(userID, connectorID, function (error, klarnaOrder) {
        console.log(error);
        console.log(klarnaOrder);
        if (error.length === 0) {
          data.klarna_consumer_token = klarnaOrder;
          response.status(200).json(klarnaOrder);
        } else if (error.includes("internalError") || error.includes("dbError")) {
          response.status(500).json(error);
        } else {
          response.status(400).json(error);
        }
      });
      return;
    }
    databaseInterfaceTransactions.addTransaction(userID, connectorID, isKlarnaPayment, pricePerKwh, function (errors, transactionID) {
      if (errors.length > 0) {
        response.status(400).json(errors);
      } else if (transactionID) {
        response.status(201).json({
          transactionID: transactionID,
        });
      } else {
        response.status(500).json(errors);
      }
    });
  });

  router.put("/start/:transactionID", function (request, response) {
    const transactionID = request.params.transactionID;
    const authorization_token = request.body.authorization_token;

    if (transactionID == 9999) {
      const data = getMockTransaction();
      response.status(200).json(data);
      return;
    }
    databaseInterfaceTransactions.createKlarnaOrder(transactionID, authorization_token, function (error, klarnaOrder) {
      console.log(error);
      console.log(klarnaOrder);
      if (error.length === 0) {
        response.status(200).json(klarnaOrder);
      } else if (error.includes("internalError") || error.includes("dbError")) {
        response.status(500).json(error);
      } else {
        response.status(400).json(error);
      }
    });
  });

  router.get("/:transactionID", function (request, response) {
    const transactionID = request.params.transactionID;

    if (transactionID == 9999) {
      const data = getMockTransaction();
      response.status(200).json(data);
      return;
    }
    databaseInterfaceTransactions.getTransaction(transactionID, function (errors, transaction) {
      if (errors.length == 0 && transaction.length == 0) {
        response.status(404).end();
      } else if (errors.length == 0) {
        response.status(200).json(transaction);
      } else {
        response.status(500).json(errors);
      }
    });
  });

  router.put("/stop/:transactionID", function (request, response) {
    const transactionID = request.params.transactionID;

    if (transactionID == 9999) {
      const data = getMockTransaction();
      response.status(200).json(data);
      return;
    }
    databaseInterfaceTransactions.finalizeKlarnaOrder(transactionID, function (error, stoppedTransaction) {
      if (error.length > 0) {
        response.status(400).json(error);
      } else if (stoppedTransaction) {
        response.status(200).json(stoppedTransaction);
      } else {
        response.status(500).json(error);
      }
    });
  });

  router.get("/userTransactions/:userID", function (request, response) {
    const userID = request.params.userID;

    databaseInterfaceTransactions.getTransactionsForUser(userID, function (errors, userTransaction) {
      if (errors.length == 0 && userTransaction.length == 0) {
        response.status(404).end();
      } else if (errors.length == 0) {
        response.status(200).json(userTransaction);
      } else {
        response.status(500).json(errors);
      }
    });
  });

  router.get("/chargerTransactions/:connectorID", function (request, response) {
    const connectorID = request.params.connectorID;
    databaseInterfaceTransactions.getTransactionsForCharger(connectorID, function (errors, chargerTransaction) {
      if (errors.length == 0 && chargerTransaction.length == 0) {
        response.status(404).end();
      } else if (errors.length == 0) {
        response.status(200).json(chargerTransaction);
      } else {
        response.status(500).json(errors);
      }
    });
  });

  return router;
};
