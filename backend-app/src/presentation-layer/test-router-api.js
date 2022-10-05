const express = require("express");

module.exports = function ({ test }) {
  const router = express.Router();

  router.get("/ocpp", async (req, res) => {
    const errors = await test.runTests();
    res.status(200).end();
  });
  return router;
};
