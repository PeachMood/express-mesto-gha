const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { Error } = require('mongoose');
const { StatusCodes } = require('http-status-codes');
const { Conflict, BadRequest } = require('http-errors');

const { jwtSecret, expiresInSec, saltLength } = require('../configs/appConfig');
const User = require('../models/user');

const register = (req, res, next) => {
  const {
    email, password, name, about, avatar,
  } = req.body;

  bcrypt.hash(password, saltLength)
    .then((hash) => User.create({
      email, name, about, avatar, password: hash,
    }))
    .then((user) => res.status(StatusCodes.CREATED).json(user.toJSON()))
    .catch((err) => {
      if (err instanceof Error.ValidationError) {
        next(new BadRequest('Переданы некорректные данные при регистрации пользователя.'));
      } else if (err.code === 11000) {
        next(new Conflict('Пользователь с данной почтой уже существует.'));
      } else {
        next(err);
      }
    });
};

const login = (req, res, next) => {
  const { email, password } = req.body;

  User.findUserByCredentials({ email, password })
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, jwtSecret, { expiresIn: expiresInSec });
      res.cookie('jwt', token, {
        httpOnly: true,
        maxAge: expiresInSec * 1000
      })
        .json({ message: 'Пользователь успешно авторизован.' });
    })
    .catch(next);
};

const logout = (req, res) => {
  res.clearCookie('jwt', { sameSite: 'none', secure: true })
    .json({ message: 'Пользователь успешно покинул сайт.' });
};

module.exports = { register, login, logout };
