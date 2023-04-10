const express = require('express');

const router = express.Router();

const authVerifier = require('../middlewares/authVerifier');
const authRouter = require('./auth');
const usersRouter = require('./users');
const cardsRouter = require('./cards');
const pagesRouter = require('./pages');

router.use('/', authRouter);
router.use('/users', authVerifier, usersRouter);
router.use('/cards', authVerifier, cardsRouter);
router.all('*', pagesRouter);

module.exports = router;
