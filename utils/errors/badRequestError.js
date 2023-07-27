const { BAD_REQUEST } = require('../status');

class badRequestError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = BAD_REQUEST;
  }
}

module.exports = badRequestError;
