const { NotFound, BadRequest } = require('http-errors');

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

module.exports = {
  getAllUsers,
  getUserById,
  getCurrentUser,
  updateProfile,
  updateAvatar,
};
