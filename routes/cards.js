const express = require('express');

const router = express.Router();

const validator = require('../middlewares/validators/cardsValidator');
const controller = require('../controllers/cards');

router.get('/', controller.getAllCards);
router.post('/', validator.isCard, controller.createCard);
router.delete('/:cardId', validator.isCardId, controller.deleteCard);
router.put('/:cardId/likes', validator.isCardId, controller.likeCard);
router.delete('/:cardId/likes', validator.isCardId, controller.dislikeCard);

module.exports = router;
