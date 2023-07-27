const { UNAUTHORIZED } = require('../status');

class unauthorizedError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = UNAUTHORIZED;
  }
}

module.exports = unauthorizedError;
