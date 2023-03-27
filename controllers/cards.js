const { NotFound, BadRequest } = require('http-errors');
const { StatusCodes } = require('http-status-codes');

const Card = require('../models/card');

const getAllCards = (req, res, next) => {
  Card.find({}, '-__v')
    .populate(['owner', 'likes'])
    .then((cards) => res.json(cards))
    .catch((err) => next(err));
};

const createCard = (req, res, next) => {
  const { name, link } = req.body;
  const owner = req.user._id;

  Card.create({ name, link, owner })
    .then((card) => res.status(StatusCodes.CREATED).json(card))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequest('Переданы некорректные данные при создании карточки.'));
      } else {
        next(err);
      }
    });
};

const deleteCard = (req, res, next) => {
  const { cardId } = req.params;

  Card.findByIdAndDelete(cardId, { select: '-__v' })
    .orFail()
    .then(() => res.json({ message: 'Пост удален.' }))
    .catch((err) => {
      // Возникает при передаче некорректного типа cardId
      if (err.name === 'CastError') {
        next(new BadRequest('Передан некорректный _id при удалении карточки.'));
      } else if (err.name === 'DocumentNotFoundError') {
        next(new NotFound(`Карточка с указанным _id:${cardId} не найдена.`));
      } else {
        next(err);
      }
    });
};

const setCardLike = (req, res, next) => {
  const { cardId, isLiked } = req.card;
  const userId = req.user._id;
  const operator = isLiked ? { $pull: { likes: userId } } : { $addToSet: { likes: userId } };

  Card.findByIdAndUpdate(cardId, operator, { new: true, runValidators: true, select: '-__v' })
    .orFail()
    .populate(['owner', 'likes'])
    .then((card) => res.json(card))
    .catch((err) => {
      if (err.name === 'DocumentNotFoundError') {
        next(new NotFound(`Карточка с указанным _id:${cardId} не найдена.`));
      } else if (err.name === 'CastError' || err.name === 'ValidationError') {
        next(new BadRequest(`Переданы некорректные данные для ${isLiked ? 'снятия' : 'добавления'} лайка.`));
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
