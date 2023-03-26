const express = require('express');
const { NotFound } = require('http-errors');

const router = express.Router();

router.all('*', (req, res, next) => {
  next(new NotFound('Страница не найдена.'));
});

module.exports = router;
