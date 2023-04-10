const express = require('express');

const router = express.Router();

const validator = require('../middlewares/validators/authValidator');
const controller = require('../controllers/users');

router.post('/signin', validator.areCredentials, controller.login);
router.post('/signup', validator.isUser, controller.createUser);

module.exports = router;
