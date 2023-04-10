const jwt = require('jsonwebtoken');
const { StatusCodes } = require('http-status-codes');
const { Unauthorized, BadRequest, Conflict } = require('http-errors');
const bcrypt = require('bcryptjs');

const User = require('../models/user');

const login = (req, res, next) => {
  const JWT_SECRET = process.env.JWT_SECRET || 'jwt-secret';
  const EXPIRES_IN_SECONDS = 7 * 24 * 60 * 60;

  const { email, password } = req.body;
  User.findUserByCredentials({ email, password })
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, JWT_SECRET, { expiresIn: EXPIRES_IN_SECONDS });
      res.cookie('jwt', token, { httpOnly: true, maxAge: EXPIRES_IN_SECONDS * 1000 })
        .json({ message: 'Пользователь успешно авторизован.' });
    })
    .catch((err) => {
      if (err.name === 'DocumentNotFoundError') {
        next(new Unauthorized('Неправильные почта или пароль.'));
      } else {
        next(err);
      }
    });
};

const register = (req, res, next) => {
  const SALT_LENGTH = 10;
  const {
    email, password, name, about, avatar,
  } = req.body;

  bcrypt.hash(password, SALT_LENGTH)
    .then((hash) => User.create({
      email, name, about, avatar, password: hash,
    }))
    .then((user) => res.status(StatusCodes.CREATED).json(user.toJSON()))
    .catch((err) => {
      if (err.code === 11000) {
        next(new Conflict('Пользователь с данной почтой уже существует.'));
      } else if (err.name === 'ValidationError') {
        next(new BadRequest('Переданы некорректные данные при регистрации пользователя.'));
      } else {
        next(err);
      }
    });
};

module.exports = { login, register };
