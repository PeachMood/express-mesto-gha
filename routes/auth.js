const express = require('express');

const router = express.Router();

const validator = require('../middlewares/validators/authValidator');
const controller = require('../controllers/auth');

router.post('/signin', validator.areCredentials, controller.login);
router.post('/signup', validator.isUser, controller.register);
router.post('/signout', controller.logout);

module.exports = router;
