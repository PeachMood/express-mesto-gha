const { NotFound, BadRequest } = require('http-errors');
const { StatusCodes } = require('http-status-codes');

const User = require('../models/user');

const getAllUsers = (req, res, next) => {
  User.find({})
    .then((users) => res.json(users))
    .catch((err) => next(err));
};

const getUser = (req, res, next) => {
  const { userId } = req.params;

  User.findById(userId)
    .orFail()
    .then((user) => res.json(user))
    .catch((err) => {
      // Возникает при передаче некорректного типа userId
      if (err.name === 'CastError') {
        next(new BadRequest('Передан некорректный _id при поиске пользователя.'));
      } else if (err.name === 'DocumentNotFoundError') {
        next(new NotFound(`Пользователь с указанным _id:${userId} не найден.`));
      } else {
        next(err);
      }
    });
};

const createUser = (req, res, next) => {
  const { name, about, avatar } = req.body;

  User.create({ name, about, avatar })
    .then((user) => res.status(StatusCodes.CREATED).json(user))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequest('Переданы некорректные данные при создании пользователя.'));
      } else {
        next(err);
      }
    });
};

const updateProfile = (req, res, next) => {
  const { name, about } = req.body;
  const userId = req.user._id;

  User.findByIdAndUpdate(userId, { name, about }, { new: true, runValidators: true })
    .orFail(() => new NotFound(`Пользователь с указанным _id:${userId} не найден.`))
    .then((user) => res.json(user))
    .catch((err) => {
      if (err.name === 'DocumentNotFoundError') {
        next(new NotFound(`Пользователь с указанным _id:${userId} не найден.`));
      } else if (err.name === 'CastError' || err.name === 'ValidationError') {
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
      } else if (err.name === 'CastError' || err.name === 'ValidationError') {
        next(new BadRequest('Переданы некорректные данные при обновлении аватара.'));
      } else {
        next(err);
      }
    });
};

module.exports = {
  getAllUsers,
  getUser,
  createUser,
  updateProfile,
  updateAvatar,
};
