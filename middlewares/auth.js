const { checkToken } = require('../utils/token');
const { UNAUTHORIZED } = require('../utils/status');

const auth = (req, _res, next) => {
  if (!req.cookies) {
    return next(new UNAUTHORIZED('Необходима авторизация'));
  }
  const token = req.cookies.jwt;
  const result = checkToken(token);

  if (!result) {
    return next(new UNAUTHORIZED('Необходима авторизация'));
  }

  return next();
};

module.exports = { auth };
