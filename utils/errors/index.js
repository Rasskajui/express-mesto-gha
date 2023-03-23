const BadRequestError = require('./BadRequestError');
const ConflictError = require('./ConflictError');
const ForbiddenError = require('./ForbiddenError');
const NotFoundError = require('./NotFoundError');
const UnauthorizedError = require('./UnauthorizedError');

module.exports = {
  ConflictError,
  ForbiddenError,
  BadRequestError,
  NotFoundError,
  UnauthorizedError,
};
