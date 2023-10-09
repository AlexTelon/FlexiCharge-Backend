const jwtAuthz = require("express-jwt-authz");

module.exports = function ({}) {
  return jwtAuthz(["Admins"], { customScopeKey: "cognito:groups" });
};
