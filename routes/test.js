const express = require('express');

const router = express.Router();

router.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error('Сервер сейчас упадёт.');
  }, 0);
});

module.exports = router;
