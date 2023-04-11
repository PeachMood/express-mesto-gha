const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { StatusCodes } = require('http-status-codes');
const { Error } = require('mongoose');
const {
  NotFound, BadRequest, Unauthorized, Conflict,
} = require('http-errors');

const User = require('../models/user');

const getAllUsers = (req, res, next) => {
  User.find({})
    .then((users) => res.json(users.map((user) => user.toJSON())))
    .catch((err) => next(err));
};

const getUserById = (req, res, next) => {
  const { userId } = req.user;
  User.findById(userId)
    .orFail()
    .then((user) => res.json(user.toJSON()))
    .catch((err) => {
      if (err instanceof Error.ValidationError) {
        next(new BadRequest('Передан некорректный _id пользователя.'));
      } else if (err instanceof Error.DocumentNotFoundError) {
        next(new NotFound(`Пользователь с указанным _id:${userId} не найден.`));
      } else {
        next(err);
      }
    });
};

const getUser = (req, res, next) => {
  req.user = { userId: req.params.userId };
  getUserById(req, res, next);
};

const getCurrentUser = (req, res, next) => {
  req.user = { userId: req.auth.userId };
  getUserById(req, res, next);
};

const updateUser = (req, res, next) => {
  const {
    userId, name, about, avatar,
  } = req.user;

  User.findByIdAndUpdate(userId, { name, about, avatar }, { new: true, runValidators: true })
    .orFail()
    .then((user) => res.json(user))
    .catch((err) => {
      if (err instanceof Error.ValidationError) {
        next(new BadRequest('Переданы некорректные данные при обновлении пользователя.'));
      } else if (err instanceof Error.DocumentNotFoundError) {
        next(new NotFound(`Пользователь с указанным _id:${userId} не найден.`));
      } else {
        next(err);
      }
    });
};

const updateProfile = (req, res, next) => {
  req.user = {
    userId: req.auth.userId,
    name: req.body.name,
    about: req.body.about,
  };
  updateUser(req, res, next);
};

const updateAvatar = (req, res, next) => {
  req.user = {
    userId: req.auth.userId,
    avatar: req.body.avatar,
  };
  updateUser(req, res, next);
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
    .catch(next);
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
      if (err instanceof Error.ValidationError) {
        next(new BadRequest('Переданы некорректные данные при регистрации пользователя.'));
      } else if (err.code === 11000) {
        next(new Conflict('Пользователь с данной почтой уже существует.'));
      } else {
        next(err);
      }
    });
};

module.exports = {
  getAllUsers,
  getUser,
  getCurrentUser,
  updateProfile,
  updateAvatar,
  createUser,
  login,
};
