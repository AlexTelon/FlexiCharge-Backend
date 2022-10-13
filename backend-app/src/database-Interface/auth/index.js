const { UnauthorizedError } = require("../error/error-types");

exports.checkIfAdmin = (userData) => {
  const roleProperty = "cognito:groups";
  const adminGroup = "Admins";

  if (
    userData.hasOwnProperty(roleProperty) &&
    userData[roleProperty].includes(adminGroup)
  )
    return true;
  throw new UnauthorizedError();
};

exports.checkIfAdminOrResourceOwnerByUserID = (userData, userID) => {
  const roleProperty = "cognito:groups";
  const adminGroup = "Admins";
  const idProperty = "sub";

  if (
    userData.hasOwnProperty(roleProperty) &&
    (userData[idProperty] == userID ||
      userData[roleProperty].includes(adminGroup))
  )
    return true;
  throw new UnauthorizedError();
};
