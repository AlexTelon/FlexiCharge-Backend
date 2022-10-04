const {
  BadRequestError,
  UnauthorizedError,
  NotFoundError,
} = require("../../database-Interface/error/error-types");

module.exports = (err, req, res, next) => {
  if (err instanceof BadRequestError) {
    res
      .status(400)
      .json({
        status: err.status,
        message: err.message,
        errorCodes: err.errorCodes, // array of error codes
      })
      .end();
  } else if (err instanceof UnauthorizedError) {
    res
      .status(401)
      .json({
        status: err.status,
        code: err.code,
        message: err.message,
      })
      .end();
  } else if (err instanceof NotFoundError) {
    res
      .status(404)
      .json({
        status: err.status,
        code: err.code,
        message: err.message,
      })
      .end();
  } else {
    res
      .status(500)
      .json({
        status: 500,
        code: "internalError",
        message: "Internal Server Error",
      })
      .end();
  }
};
