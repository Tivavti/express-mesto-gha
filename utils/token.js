const jwt = require('jsonwebtoken');

const SUPER_SECRET_KEY = 'key';

function generateToken(payload) {
  return jwt.sign(payload, SUPER_SECRET_KEY, { expiresIn: '7d' });
}

function checkToken(token) {
  if (!token) {
    return false;
  }

  try {
    return jwt.verify(token, SUPER_SECRET_KEY);
  } catch (error) {
    return false;
  }
}

function getIdFromToken(token) {
  if (!token) {
    return false;
  }

  const decode = jwt.verify(token, SUPER_SECRET_KEY)._id;
  return decode;
}

module.exports = { generateToken, checkToken, getIdFromToken };
