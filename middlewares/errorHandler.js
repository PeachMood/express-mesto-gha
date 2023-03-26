const createError = require('http-errors');

const errorHandler = (err, req, res) => {
  let theErr = err;
  if (!createError.isHttpError(err)) {
    theErr = new createError.InternalServerError(`Ошибка сервера: ${err.message}`);
  }
  res.status(theErr.status);
  res.json({ message: theErr.message });
};

module.exports = errorHandler;
