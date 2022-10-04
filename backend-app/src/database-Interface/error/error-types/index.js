class BadRequestError extends Error {
  status = 400;

  constructor(errorCodes = [], message = "Bad Request") {
    super(message);
    message = message;
    this.errorCodes = errorCodes;
  }
}

class UnauthorizedError extends Error {
  status = 401;
  code = "unauthorizedError";

  constructor(message = "Unauthorized") {
    super(message);
    message = message;
  }
}

class NotFoundError extends Error {
  status = 404;
  code = "notFoundError";

  constructor(message = "Resource not found.") {
    super(message);
    message = message;
  }
}

module.exports = {
    BadRequestError,
    UnauthorizedError,
    NotFoundError
}
