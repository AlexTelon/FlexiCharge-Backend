const jwt = require("jsonwebtoken");

module.exports = function ({}) {
  const exports = {};

  exports.isAdmin = function (user) {
    return user["cognito:groups"].includes("Admins");
  };
  exports.getUserByIdToken = function (idToken) {
    const decoded = jwt.decode(idToken);
    return decoded;
  };

  return exports;
};
