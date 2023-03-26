const express = require('express');

const router = express.Router();

const controller = require('../controllers/users');

router.get('/', controller.getAllUsers);
router.get('/:userId', controller.getUser);
router.post('/', controller.createUser);
router.patch('/me', controller.updateProfile);
router.patch('/me/avatar', controller.updateAvatar);

module.exports = router;
