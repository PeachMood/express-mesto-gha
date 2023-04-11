const { celebrate, Joi } = require('celebrate');
const validator = require('validator');

const isCardId = celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().hex().length(24).required(),
  }),
});

const isCard = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30).required(),
    link: Joi.string().required().custom((value, helper) => (validator.isURL(value) ? value : helper.message('Link must be a valid URL.'))),
  }),
});

module.exports = { isCardId, isCard };
