const { Forbidden, NotFound, BadRequest } = require('http-errors');
const { StatusCodes } = require('http-status-codes');
const { Error } = require('mongoose');

const Card = require('../models/card');

const getAllCards = (req, res, next) => {
  Card.find({})
    .populate(['owner', 'likes'])
    .then((cards) => res.json(cards))
    .catch((err) => next(err));
};

const createCard = (req, res, next) => {
  const { name, link } = req.body;
  const owner = req.auth.userId;

  Card.create({ name, link, owner })
    .then((card) => card.populate(['owner', 'likes']))
    .then((card) => res.status(StatusCodes.CREATED).json(card))
    .catch((err) => {
      if (err instanceof Error.ValidationError) {
        next(new BadRequest('Переданы некорректные данные при создании карточки.'));
      } else {
        next(err);
      }
    });
};

const deleteCard = (req, res, next) => {
  const { cardId } = req.params;

  Card.findById(cardId)
    .orFail()
    .then((card) => {
      if (card.owner.toString() !== req.auth.userId) {
        return Promise.reject(new Forbidden(`Нет прав на удаление карточки, с указанным _id: ${cardId}.`));
      }
      return Card.deleteOne(card);
    })
    .then(() => res.json({ message: 'Пост удален.' }))
    .catch((err) => {
      if (err instanceof Error.CastError) {
        next(new BadRequest('Передан некорректный _id карточки.'));
      } else if (err instanceof Error.DocumentNotFoundError) {
        next(new NotFound(`Карточка с указанным _id:${cardId} не найдена.`));
      } else {
        next(err);
      }
    });
};

const setCardLike = (req, res, next) => {
  const { cardId, isLiked } = req.card;
  const { userId } = req.auth;
  const operator = isLiked ? { $pull: { likes: userId } } : { $addToSet: { likes: userId } };

  Card.findByIdAndUpdate(cardId, operator, { new: true, runValidators: true })
    .orFail()
    .populate(['owner', 'likes'])
    .then((card) => res.json(card))
    .catch((err) => {
      if (err instanceof Error.CastError) {
        next(new BadRequest('Передан некорректный _id карточки'));
      } else if (err instanceof Error.DocumentNotFoundError) {
        next(new NotFound(`Карточка с указанным _id:${cardId} не найдена.`));
      } else {
        next(err);
      }
    });
};

const likeCard = (req, res, next) => {
  req.card = { cardId: req.params.cardId, isLiked: false };
  setCardLike(req, res, next);
};

const dislikeCard = (req, res, next) => {
  req.card = { cardId: req.params.cardId, isLiked: true };
  setCardLike(req, res, next);
};

module.exports = {
  getAllCards,
  createCard,
  deleteCard,
  likeCard,
  dislikeCard,
};
