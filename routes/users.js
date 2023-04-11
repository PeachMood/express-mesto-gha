const express = require('express');

const router = express.Router();

const validator = require('../middlewares/validators/usersValidator');
const controller = require('../controllers/users');

router.get('/', controller.getAllUsers);
router.get('/me', controller.getCurrentUser);
router.get('/:userId', validator.isUserId, controller.getUser);
router.patch('/me', validator.isProfile, controller.updateProfile);
router.patch('/me/avatar', validator.isAvatar, controller.updateAvatar);

module.exports = router;
