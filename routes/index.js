const express = require('express');

const router = express.Router();

const usersRouter = require('./users');
const cardsRouter = require('./cards');
const pagesRouter = require('./pages');

router.use('/users', usersRouter);
router.use('/cards', cardsRouter);
router.all('*', pagesRouter);

module.exports = router;
