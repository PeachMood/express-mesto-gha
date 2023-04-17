const { Error } = require('mongoose');
const { NotFound, BadRequest } = require('http-errors');

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
      if (err instanceof Error.CastError) {
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
    .then((user) => res.json(user.toJSON()))
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

module.exports = {
  getAllUsers,
  getUser,
  getCurrentUser,
  updateProfile,
  updateAvatar,
};
