const { celebrate, Joi } = require('celebrate');
const validator = require('validator');

const areCredentials = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
});

const isUser = celebrate({
  body: Joi.object().keys({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().custom((value, helper) => (validator.isURL(value) ? value : helper.message('Avatar must be a valid URL.'))),
  }),
});

module.exports = { areCredentials, isUser };
