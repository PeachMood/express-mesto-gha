const express = require('express');

const router = express.Router();

const controller = require('../controllers/cards');

router.get('/', controller.getAllCards);
router.post('/', controller.createCard);
router.delete('/:cardId', controller.deleteCard);
router.put('/:cardId/likes', controller.likeCard);
router.delete('/:cardId/likes', controller.dislikeCard);

module.exports = router;
