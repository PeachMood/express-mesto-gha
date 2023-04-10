const jwt = require('jsonwebtoken');
const { Unauthorized } = require('http-errors');

const authVerifier = (req, res, next) => {
  const JWT_SECRET = process.env.JWT_SECRET || 'jwt-secret';
  const ERROR_MESSAGE = 'Требуется авторизация.';
  const token = req.cookies.jwt;

  if (!token) {
    next(new Unauthorized(ERROR_MESSAGE));
    return;
  }

  try {
    req.user = jwt.verify(token, JWT_SECRET);
    next();
  } catch (err) {
    next(new Unauthorized(ERROR_MESSAGE));
  }
};

module.exports = authVerifier;
