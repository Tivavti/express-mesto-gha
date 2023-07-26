const { Unauthorized } = require('../utils/errors');
const { checkToken, getIdFromToken } = require('../utils/token');

// eslint-disable-next-line consistent-return
const auth = (req, _res, next) => {
  if (!req.cookies) {
    return next(new Unauthorized('Необходима авторизация'));
  }

  const token = req.cookies.jwt;
  const result = checkToken(token);
  const userId = getIdFromToken(token);

  req.user = { userId };

  if (!result) {
    return next(new Unauthorized('Необходима авторизация'));
  }

  next();
};

module.exports = auth;

/* const jwt = require('jsonwebtoken');
const { UNAUTHORIZED } = require('../utils/errors');

const handleAuthError = (res) => {
  res
    .status(UNAUTHORIZED)
    .send({ message: 'Необходима авторизация' });
};

const extractBearerToken = (header) => {
  return header.replace('Bearer ', '');
};

module.exports = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    return handleAuthError(res);
  }

  const token = extractBearerToken(authorization);
  let payload;

  try {
    payload = jwt.verify(token, 'itsy-bitsy-teeny-weeny-secret');
  } catch (err) {
    return handleAuthError(res);
  }

  req.user = payload;

  next();
};
*/
