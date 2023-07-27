const { NOT_FOUND } = require('../status');

class notFoundError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = NOT_FOUND;
  }
}

module.exports = notFoundError;
