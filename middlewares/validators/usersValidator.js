const { celebrate, Joi } = require('celebrate');
const validator = require('validator');

const isUserId = celebrate({
  params: Joi.object().keys({
    userId: Joi.string().hex().length(24).required(),
  }),
});

const isProfile = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30).required(),
    about: Joi.string().min(2).max(30).required(),
  }),
});

const isAvatar = celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().required().custom((value, helper) => (validator.isURL(value) ? value : helper.message('Avatar must be a valid URL.'))),
  }),
});

module.exports = { isUserId, isProfile, isAvatar };
