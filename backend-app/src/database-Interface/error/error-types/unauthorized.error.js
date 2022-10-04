class UnauthorizedError extends Error {
  status = 401;
  code = "unauthorizedError";

  constructor(message = "Unauthorized") {
    super(message);
    message = message;
  }
}

module.exports = UnauthorizedError;
