const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const {
  NotFound, BadRequest, Unauthorized, Conflict,
} = require('http-errors');
const { StatusCodes } = require('http-status-codes');

const User = require('../models/user');

const getAllUsers = (req, res, next) => {
  User.find({})
    .then((users) => res.json(users.map((user) => user.toJSON())))
    .catch((err) => next(err));
};

const getUserById = (req, res, next) => {
  const { userId } = req.params;

  User.findById(userId)
    .orFail()
    .then((user) => res.json(user.toJSON()))
    .catch((err) => {
      if (err.name === 'DocumentNotFoundError') {
        next(new NotFound(`Пользователь с указанным _id:${userId} не найден.`));
      } else {
        next(err);
      }
    });
};

const getCurrentUser = (req, res, next) => {
  const userId = req.user._id;

  User.findById(userId)
    .orFail()
    .then((user) => res.json(user.toJSON()))
    .catch((err) => {
      if (err.name === 'DocumentNotFoundError') {
        next(new NotFound(`Пользователь с указанным _id:${userId} не найден.`));
      } else {
        next(err);
      }
    });
};

const updateProfile = (req, res, next) => {
  const { name, about } = req.body;
  const userId = req.user._id;

  User.findByIdAndUpdate(userId, { name, about }, { new: true, runValidators: true })
    .orFail()
    .then((user) => res.json(user))
    .catch((err) => {
      if (err.name === 'DocumentNotFoundError') {
        next(new NotFound(`Пользователь с указанным _id:${userId} не найден.`));
      } else if (err.name === 'ValidationError') {
        next(new BadRequest('Переданы некорректные данные при обновлении пользователя.'));
      } else {
        next(err);
      }
    });
};

const updateAvatar = (req, res, next) => {
  const { avatar } = req.body;
  const userId = req.user._id;

  User.findByIdAndUpdate(userId, { avatar }, { new: true, runValidators: true })
    .orFail()
    .then((user) => res.json(user))
    .catch((err) => {
      if (err.name === 'DocumentNotFoundError') {
        next(new NotFound(`Пользователь с указанным _id:${userId} не найден.`));
      } else if (err.name === 'ValidationError') {
        next(new BadRequest('Переданы некорректные данные при обновлении аватара.'));
      } else {
        next(err);
      }
    });
};

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

const createUser = (req, res, next) => {
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

module.exports = {
  getAllUsers,
  getUserById,
  getCurrentUser,
  updateProfile,
  updateAvatar,
  createUser,
  login,
};
