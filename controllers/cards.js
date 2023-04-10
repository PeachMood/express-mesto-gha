const { Forbidden, NotFound, BadRequest } = require('http-errors');
const { StatusCodes } = require('http-status-codes');

const Card = require('../models/card');

const getAllCards = (req, res, next) => {
  Card.find({})
    .populate(['owner', 'likes'])
    .then((cards) => res.json(cards.map((card) => card.toJSON())))
    .catch((err) => next(err));
};

const createCard = (req, res, next) => {
  const { name, link } = req.body;
  const owner = req.user._id;

  Card.create({ name, link, owner })
    .then((card) => res.status(StatusCodes.CREATED).json(card.toJSON()))
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

  Card.findById(cardId)
    .then((card) => {
      if (!card) {
        return Promise.reject(new NotFound(`Карточка с указанным _id:${cardId} не найдена.`));
      } if (card.owner.toString() !== req.user._id) {
        return Promise.reject(new Forbidden(`Нет прав на удаление карточки, с указанным _id: ${cardId}.`));
      }
      return Card.deleteOne(card);
    })
    .then(() => res.json({ message: 'Пост удален.' }))
    .catch((err) => next(err));
};

const setCardLike = (req, res, next) => {
  const { cardId, isLiked } = req.card;
  const userId = req.user._id;
  const operator = isLiked ? { $pull: { likes: userId } } : { $addToSet: { likes: userId } };

  Card.findByIdAndUpdate(cardId, operator, { new: true, runValidators: true })
    .orFail()
    .populate(['owner', 'likes'])
    .then((card) => res.json(card.toJSON()))
    .catch((err) => {
      if (err.name === 'DocumentNotFoundError') {
        next(new NotFound(`Карточка с указанным _id:${cardId} не найдена.`));
      } else if (err.name === 'ValidationError') {
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
