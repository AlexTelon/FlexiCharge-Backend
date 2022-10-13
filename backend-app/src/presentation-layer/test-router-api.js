const express = require("express");

module.exports = function ({ tester }) {
  const router = express.Router();

  router.get("/ocpp", (req, res) => {
    tester.runTests(function(testResults){
      res.status(200).json(testResults)
    });
  });
  return router;
};
